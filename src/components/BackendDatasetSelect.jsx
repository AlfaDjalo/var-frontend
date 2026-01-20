// src/components/BackendDatasetSelect.jsx
import React from "react";

export function BackendDatasetSelect({ datasets, onDatasetSelected }) {
  if (!Array.isArray(datasets) || datasets.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: "16px" }}>
      <label>
        <strong>Or select a sample dataset:</strong>{" "}
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              onDatasetSelected(e.target.value);
            }
          }}
        >
          <option value="" disabled>
            -- select dataset --
          </option>
          {datasets.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default BackendDatasetSelect;