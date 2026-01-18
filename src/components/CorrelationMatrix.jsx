// src/components/CovarianceMatrix.jsx
import React from "react";

const CorrelationMatrix = ({ corrMatrix }) => {
  if (!corrMatrix || corrMatrix.length === 0) {
    return <div>No correlation matrix available</div>;
  }

  return (
    <div>
      <h3>Correlation Matrix</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <tbody>
            {corrMatrix.map((row, i) => (
              <tr key={i}>
                {row.map((value, j) => (
                  <td
                    key={j}
                    style={{
                      border: "1px solid #ccc",
                      padding: "4px 6px",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {value.toFixed(2)}%
                    {/* {value.toExponential(2)} */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CorrelationMatrix;
