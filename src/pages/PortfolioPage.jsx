import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import PortfolioPanel from "../components/PortfolioPanel";

function PortfolioPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const assets = state.data.assets;
  const spotPrices = state.data.spotPrices;

  const [localPositions, setLocalPositions] = useState(
    state.portfolio.positions
  );

  useEffect(() => {
    setLocalPositions(state.portfolio.positions);
  }, [state.data.datasetName]);
  // }, [state.portfolio.positions]);

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

    dispatch({ type: "SET_VAR_RESULT", payload: null });

    navigate("/");
  };

  const onCancelChanges = () => {
    setLocalPositions(state.portfolio.positions);
    navigate("/");
  };

  // ---------- Save Portfolio File ----------
  const handleSavePortfolioToFile = async () => {
    // const payload = {
    //   datasetName: state.data.datasetName,
    //   positions: localPositions,
    // };
    const portfolioFile = {
      dataset: {
        datasetName: state.data.datasetName,
        datasetSource: state.data.datasetSource,
      },
      positions: localPositions,
    };

    const dataToSave = JSON.stringify(portfolioFile, null, 2);
    // const dataToSave = JSON.stringify(payload, null, 2);

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


  // ---------- Load Portfolio File ----------
  const loadInputRef = useRef(null);

  const handleLoadClick = () => {
    loadInputRef.current.click();
  };

  const inspectDataset = async (datasetName) => {
    const res = await fetch(`${API_BASE_URL}/datasets/inspect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataset_name: datasetName }),
    });

    if (!res.ok) throw new Error("Inspect failed");

    return await res.json();
  };

  const handleLoadPortfolio = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        console.log(parsed);

        if (!parsed.dataset || !parsed.positions) {
          alert("Invalid portfolio file format");
          return;
        }

        // const datasetName = parsed.datasetName;
        const { dataset, positions } = parsed;
        console.log("positions: ", positions)

        dispatch({
          type: "SET_DATASET",
          payload: {
            name: dataset.datasetName,
            source: dataset.datasetSource,
          },
        });

        const data = await inspectDataset(dataset.datasetName);

        dispatch({
          type: "SET_MARKET_DATA",
          payload: {
            assets: data.assets,
            spotPrices: data.spot_prices || {},
          },
        });

        const validAssets = data.assets;

        const cleaned = Object.fromEntries(
          Object.entries(parsed.positions).filter(([__dirname, pos]) => {
            const ticker = 
              pos.product_type === "stock"
              ? pos.ticker
              : pos.underlying;

              return validAssets.includes(ticker);
          })
        );

        const removedCount = 
          Object.keys(parsed.positions).length -
          Object.keys(cleaned).length;

        if (removedCount > 0) {
          alert(
            `${removedCount} positions removed (assets not in dataset)`
          );
        }
        console.log("Cleaned: ", cleaned)
        setLocalPositions(cleaned);

        dispatch({ type: "SET_VAR_RESULT", payload: null });

        alert("Portfolio + dataset loaded");
        // if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        //   setLocalPositions(parsed);
        // } else {
        //   alert("Invalid format");
        // }
      } catch (err) {
        console.error(err);
        alert("Failed to load portfolio");
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
