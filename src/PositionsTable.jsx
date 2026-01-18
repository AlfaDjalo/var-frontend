function PositionsTable({ assets, positions, onHoldingChange }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th align="left">Asset</th>
          <th align="right">Holding ($)</th>
        </tr>
      </thead>
      <tbody>
        {assets.map(asset => (
          <tr key={asset}>
            <td>{asset}</td>
            <td align="right">
              <input
                type="number"
                min="0"
                step="1"
                value={positions[asset] ?? 0}
                onChange={(e) =>
                  onHoldingChange(asset, Number(e.target.value))
                }
                style={{ width: 120 }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PositionsTable;
