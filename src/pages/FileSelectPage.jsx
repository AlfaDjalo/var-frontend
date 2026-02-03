import React from "react";
import FileSelect from "../components/FileSelect";

export default function FileSelectPage({ datasetName, setDatasetName, setDatasetSource, setError }) {
  return (
    <div>
      <FileSelect
        apiBaseUrl={import.meta.env.VITE_API_BASE_URL}
        onDatasetLoaded={(name, source) => {
          setDatasetName(name);
          setDatasetSource(source);
          setError(null);
        }}
      />
      {datasetName && <p>Loaded dataset: <strong>{datasetName}</strong></p>}
    </div>
  );
}
