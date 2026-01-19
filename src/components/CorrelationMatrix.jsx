import React from "react";

const CorrelationMatrix = ({ corrMatrix, tickers }) => {
  if (!corrMatrix || corrMatrix.length === 0 || !tickers || tickers.length === 0) {
    return <div>No correlation matrix available</div>;
  }

  return (
    <div>
      <h3>Correlation Matrix</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "4px 6px" }}></th>
              {tickers.map((ticker, i) => (
                <th
                  key={i}
                  style={{
                    border: "1px solid #ccc",
                    padding: "4px 6px",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {ticker}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {corrMatrix.map((row, i) => (
              <tr key={i}>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "4px 6px",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  {tickers[i]}
                </th>
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
                    {(value * 100).toFixed(2)}%
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
