import { formatCurrency } from "../helpers/RiskPageHelpers";

function FactorExposureTable({ exposures }) {
  if (!exposures || Object.keys(exposures).length === 0) {
    return null;
  }

  const rows = Object.entries(exposures).sort(
    (a, b) => Math.abs(b[1]) - Math.abs(a[1])
  );

  return (
    <div style={cardStyle}>
      <h3>Risk Factor Exposures</h3>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Factor</th>
            <th>Exposure</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([factor, value]) => (
            <tr key={factor}>
              <td>{factor}</td>
              <td>{formatCurrency(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle = {
  padding: 16,
  marginBottom: 24,
  border: "1px solid #ddd",
  borderRadius: 6,
  background: "#fff",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

export default FactorExposureTable;
