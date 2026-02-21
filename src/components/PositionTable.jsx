import { formatCurrency } from "../helpers/RiskPageHelpers";
import { useApp } from "../context/AppContext";

function PositionTable({ positions }) {
  const { state } = useApp();
  const portfolioPositions = state.portfolio.positions;

  return (
    <div style={cardStyle}>
      <h3>Position Greeks</h3>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Δ</th>
            <th>Γ</th>
            <th>Vega</th>
            <th>Theta</th>
            <th>Rho</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((riskPos) => {
            const portfolioPos = portfolioPositions[riskPos.product_id];

            return (
              <tr key={riskPos.product_id}>
                <td>{buildDescription(portfolioPos)}</td>
                <td>{formatCurrency(riskPos.greeks?.dollar_delta)}</td>
                <td>{formatCurrency(riskPos.greeks?.dollar_gamma)}</td>
                <td>{formatCurrency(riskPos.greeks?.dollar_vega)}</td>
                <td>{formatCurrency(riskPos.greeks?.dollar_theta)}</td>
                <td>{formatCurrency(riskPos.greeks?.dollar_rho)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function buildDescription(pos) {
  if (!pos) return "Unknown Position";

  if (pos.product_type === "stock") {
    return `${pos.quantity} ${pos.ticker}`;
  }

  if (pos.product_type === "option") {
    return `${pos.quantity} ${pos.option_type.toUpperCase()} ${pos.underlying} K=${pos.strike} T=${pos.maturity}Y`;
  }

  return pos.product_type;
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

export default PositionTable;
