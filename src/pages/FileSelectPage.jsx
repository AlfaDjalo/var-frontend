import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
// import "../styles/FileSelect.css";

function FileSelectPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [datasets, setDatasets] = useState([]);
  const [selectedBackendFile, setSelectedBackendFile] = useState(state.data.datasetName || "");
  const [localFileName, setLocalFileName] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/datasets`)
      .then((res) => res.json())
      .then((data) => setDatasets(data.files || []))
      .catch(() => setDatasets([]));
  }, [API_BASE_URL]);

  const inspectDataset = async (datasetName, datasetSource) => {
    if (!datasetName) return;

    try {
      const res = await fetch(`${API_BASE_URL}/parametric/inspect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset_name: datasetName }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      dispatch({
        type: "SET_MARKET_DATA",
        payload: {
          assets: data.assets,
          spotPrices: data.spot_prices || {},
        },
      });

      dispatch({ type: "SET_ERROR", payload: null });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to inspect dataset" });
    }
  };

  const onBackendChange = (e) => {
    const filename = e.target.value;
    setSelectedBackendFile(filename);

    if (filename) {
      inspectDataset(filename, "backend");
    }
  };

  const onChooseLocal = () => {
    fileInputRef.current.click();
  };

  const onLocalPicked = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      setSelectedBackendFile(data.filename); // Update selectedBackendFile for local upload
      await inspectDataset(data.filename, "local");
    } catch {
      alert("Upload failed due to network or server error");
    } finally {
      e.target.value = "";
    }
  };

  // Save handler: dispatch updated datasetName and navigate home
  const onSaveAndExit = () => {
    if (!selectedBackendFile) {
      alert("Please select or upload a dataset before saving.");
      return;
    }

    dispatch({
      type: "SET_DATASET",
      payload: { name: selectedBackendFile, source: "user" },
    });

    navigate("/");
  };

  // Cancel handler: revert local state to context datasetName and navigate home
  const onCancelChanges = () => {
    setSelectedBackendFile(state.data.datasetName || "");
    setLocalFileName(""); // Clear local file name since we revert to context dataset
    navigate("/");
  };

  return (
    <div className="file-page">
      <div className="file-card">
        <h2>Load Market Data</h2>

        <div className="file-section">
          <h3>Use sample dataset</h3>
          <select
            value={selectedBackendFile}
            onChange={onBackendChange}
            className="file-select"
          >
            <option value="">Select dataset...</option>
            {datasets.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="divider">or</div>

        <div className="file-section">
          <h3>Upload CSV</h3>

          <button className="primary-btn" onClick={onChooseLocal}>
            Choose CSV File
          </button>

          <div className="file-name">{localFileName || "No file selected"}</div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={onLocalPicked}
          />
        </div>

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
    </div>
  );
}

export default FileSelectPage;
