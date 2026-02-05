import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import PortfolioPanel from "../components/PortfolioPanel";

function PortfolioPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const assets = state.data.assets;
  const spotPrices = state.data.spotPrices;

  const [localPositions, setLocalPositions] = useState(
    state.portfolio.positions
  );

  useEffect(() => {
    setLocalPositions(state.portfolio.positions);
  }, [state.portfolio.positions]);

  // // --- SOURCE OF TRUTH IN CONTEXT ---
  // const contextPositions = state.portfolio.positions;

  // // --- LOCAL DRAFT ---
  // const [draftPositions, setDraftPositions] = useState(
  //   structuredClone(contextPositions)
  // );

  // Re-sync draft if context changes (e.g. load portfolio elsewhere)
  // useEffect(() => {
  //   setDraftPositions(structuredClone(contextPositions));
  // }, [contextPositions]);

  // Convert draft object -> array for panel
  const positionsArray = Object.entries(localPositions).map(([id, pos]) => ({
    ...pos,
    id,
  }));

  // ---------- Draft Editing ----------
  const handleAddPosition = (position) => {
    const id = crypto.randomUUID();
    setLocalPositions((prev) => ({
      ...prev,
      [id]: position,
    }));
  };

  const handleDeletePosition = (id) => {
    setLocalPositions((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // ---------- Save / Cancel ----------
  const onSaveAndExit = () => {
    dispatch({
      type: "SET_POSITIONS",
      payload: localPositions,
    });
    // alert("Portfolio changes saved");
    navigate("/");
  };

  const onCancelChanges = () => {
    setLocalPositions(state.portfolio.positions);
    // setDraftPositions(structuredClone(contextPositions));
    // alert("Changes discarded");
    navigate("/");
  };

  // ---------- Optional File Save ----------
  const handleSavePortfolioToFile = async () => {
    const dataToSave = JSON.stringify(localPositions, null, 2);

    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          types: [
            {
              description: "JSON Files",
              accept: { "application/json": [".json"] },
            },
          ],
          suggestedName: "portfolio.json",
        });

        const writable = await handle.createWritable();
        await writable.write(dataToSave);
        await writable.close();
        alert("Portfolio file saved");
        return;
      } catch (err) {
        console.warn(err);
      }
    }

    const blob = new Blob([dataToSave], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const loadInputRef = useRef(null);

  const handleLoadClick = () => {
    loadInputRef.current.click();
  };

  const handleLoadPortfolio = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);

        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          setLocalPositions(parsed);
        } else {
          alert("Invalid format");
        }
      } catch {
        alert("Parse error");
      }
    };

    reader.readAsText(file);
    e.target.value = null;
  };

  // ---------- UI ----------
  return (
    <div>
      <h2>Portfolio Overview</h2>

      <div style={{ marginBottom: 16, display: "flex", gap: 12 }}>
        <button className="btn btn-primary" onClick={handleLoadClick}>
          Load Portfolio File
        </button>

        <input
          ref={loadInputRef}
          type="file"
          accept=".json"
          hidden
          onChange={handleLoadPortfolio}
        />

        <button className="btn btn-primary" onClick={handleSavePortfolioToFile}>
          Save Portfolio File
        </button>
      </div>

      {/* <div style={{ marginBottom: 16 }}> */}
        {/* <button onClick={handleSaveAndExit}>Save & Exit</button>

        <button
          onClick={handleCancelChanges}
          style={{ marginLeft: 10 }}
        >
          Cancel Changes
        </button> */}

        {/* <button className="btn btn-primary" onClick={handleSavePortfolioToFile}> */}

        {/* <button
          onClick={handleSavePortfolioToFile}
          style={{ marginLeft: 20 }}
        > */}
          {/* Export File */}
        {/* </button> */}

        {/* <button className="btn btn-primary" onClick={handleSavePortfolioToFile}> */}
        {/* <label
          style={{
            marginLeft: 20,
            cursor: "pointer",
            color: "blue",
            textDecoration: "underline",
          }}
        > */}
          {/* Load File
          <input
            type="file"
            accept=".json"
            hidden
            onChange={handleLoadPortfolio}
          />
        </button> */}
        {/* </label> */}
      {/* </div> */}

      <PortfolioPanel
        assets={assets}
        spotPrices={spotPrices}
        positions={positionsArray}
        onAddPosition={handleAddPosition}
        onDeletePosition={handleDeletePosition}
      />

      <div className="button-row">
        <button className="btn btn-primary" onClick={onSaveAndExit}>
          Save and Exit
        </button>
        {/* <button className="primary-btn cancel-btn" onClick={onCancelChanges}> */}
        <button className="btn btn-secondary" onClick={onCancelChanges}>
          Cancel Changes
        </button>
      </div>

    </div>
  );
}

export default PortfolioPage;
