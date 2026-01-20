import React, { useEffect, useRef, useState } from "react";

const FileSelect = ({ apiBaseUrl, onDatasetLoaded }) => {
  const [source, setSource] = useState("backend"); // "backend" | "local"
  const [datasets, setDatasets] = useState([]);
  const [selectedBackendFile, setSelectedBackendFile] = useState("");
  const [localFileName, setLocalFileName] = useState("");

  const fileInputRef = useRef(null);

  /* Load backend datasets */
  useEffect(() => {
    fetch(`${apiBaseUrl}/datasets`)
      .then((res) => res.json())
      .then((data) => setDatasets(data.files || []))
      .catch(() => setDatasets([]));
  }, [apiBaseUrl]);

  /* Backend dataset selected */
  const onBackendChange = (e) => {
    const filename = e.target.value;
    setSelectedBackendFile(filename);
    setLocalFileName("");
    setSource("backend");

    if (filename) {
      onDatasetLoaded(filename);
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

    const res = await fetch(`${apiBaseUrl}/datasets/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("Upload failed");
      return;
    }

    const data = await res.json();
    setLocalFileName(file.name);
    onDatasetLoaded(data.filename);
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
};

export default FileSelect;
