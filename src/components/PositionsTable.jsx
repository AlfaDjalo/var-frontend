function PositionsTable({ assets, positions, spotPrices, inputMode, onHoldingChange }) {
  const label = inputMode === "quantity" ? "Quantity" : "Holding ($)";
  const stepQuantity = "0.0001"; // small step for quantity input
  const stepMarketValue = "0.01"; // cents step for market value input

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
      <thead>
        <tr>
          <th align="left">Asset</th>
          <th align="right">Quantity</th>
          <th align="right">Market Value ($)</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((asset) => {
          const spot = spotPrices[asset] || 0;
          const pos = positions[asset] || { quantity: 0, marketValue: 0 };

          return (
            <tr key={asset}>
              <td>{asset}</td>

              {/* Quantity column */}
              <td align="right">
                {inputMode === "quantity" ? (
                  <input
                    type="number"
                    min="0"
                    step={stepQuantity}
                    value={pos.quantity}
                    onChange={(e) => {
                      const newQuantity = parseFloat(e.target.value) || 0;
                      onHoldingChange(asset, {
                        quantity: newQuantity,
                        marketValue: +(newQuantity * spot).toFixed(2),
                      });
                    }}
                    style={{ width: 140 }}
                  />
                ) : (
                  // Display quantity rounded to 4 decimals when market value is input mode
                  <span>{pos.quantity.toFixed(4)}</span>
                )}
              </td>

              {/* Market Value column */}
              <td align="right">
                {inputMode === "market_value" ? (
                  <input
                    type="number"
                    min="0"
                    step={stepMarketValue}
                    value={pos.marketValue.toFixed(2)}
                    onChange={(e) => {
                      const newMarketValue = parseFloat(e.target.value) || 0;
                      onHoldingChange(asset, {
                        marketValue: newMarketValue,
                        quantity:
                          spot > 0 ? newMarketValue / spot : 0,
                      });
                    }}
                    style={{ width: 140 }}
                  />
                ) : (
                  // Display market value fixed to 2 decimals when quantity is input mode
                  <span>{pos.marketValue.toFixed(2)}</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default PositionsTable;
