import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";

function FileSelectPage() {
  const { dispatch } = useApp();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [source, setSource] = useState("backend");
  const [datasets, setDatasets] = useState([]);
  const [selectedBackendFile, setSelectedBackendFile] = useState("");
  const [localFileName, setLocalFileName] = useState("");

  const fileInputRef = useRef(null);

  /* Load backend dataset list */
  useEffect(() => {
    fetch(`${API_BASE_URL}/datasets`)
      .then((res) => res.json())
      .then((data) => setDatasets(data.files || []))
      .catch(() => setDatasets([]));
  }, [API_BASE_URL]);

  /* Inspect dataset + load market data */
  const inspectDataset = async (datasetName, datasetSource) => {
    if (!datasetName) return;

    dispatch({
      type: "SET_DATASET",
      payload: { name: datasetName, source: datasetSource },
    });

    try {
      const res = await fetch(`${API_BASE_URL}/parametric/inspect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset_name: datasetName }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      // const positions = {};
      // data.assets.forEach((asset) => {
      //   const spot = data.spot_prices?.[asset] ?? 0;
      //   const marketValue = 100;
      //   const quantity = spot ? marketValue / spot : 0;

      //   positions[asset] = { quantity, marketValue };
      // });

      dispatch({
        type: "SET_MARKET_DATA",
        payload: {
          assets: data.assets,
          spotPrices: data.spot_prices || {},
          // positions,
        },
      });

      dispatch({ type: "SET_ERROR", payload: null });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to inspect dataset" });
    }
  };

  /* Backend selection */
  const onBackendChange = (e) => {
    const filename = e.target.value;

    setSelectedBackendFile(filename);
    setLocalFileName("");
    setSource("backend");

    if (filename) {
      inspectDataset(filename, "backend");
    }
  };

  /* Local upload */
  const onChooseLocal = () => {
    fileInputRef.current.click();
  };

  const onLocalPicked = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSource("local");
    setSelectedBackendFile("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/datasets/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("Upload failed");
        return;
      }

      const data = await res.json();

      setLocalFileName(file.name);

      await inspectDataset(data.filename, "local");
    } catch {
      alert("Upload failed due to network or server error");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, maxWidth: 500 }}>
      <h3>Dataset selection</h3>

      {/* Backend datasets */}
      <label>
        <input
          type="radio"
          checked={source === "backend"}
          onChange={() => setSource("backend")}
        />
        Load sample dataset (server)
      </label>

      <div style={{ marginLeft: 24, marginTop: 6 }}>
        <select
          disabled={source !== "backend"}
          value={selectedBackendFile}
          onChange={onBackendChange}
        >
          <option value="">Select dataset…</option>
          {datasets.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <hr />

      {/* Local upload */}
      <label>
        <input
          type="radio"
          checked={source === "local"}
          onChange={() => setSource("local")}
        />
        Upload local CSV
      </label>

      <div style={{ marginLeft: 24, marginTop: 6 }}>
        <button onClick={onChooseLocal} disabled={source !== "local"}>
          Choose file
        </button>

        <span style={{ marginLeft: 10, fontStyle: "italic" }}>
          {localFileName || "No file selected"}
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={onLocalPicked}
      />
    </div>
  );
}

export default FileSelectPage;
