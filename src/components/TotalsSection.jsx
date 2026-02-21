import { renderGreek } from "../helpers/RiskPageHelpers";

function TotalsSection({ totals }) {
  return (
    <div style={cardStyle}>
      <h3>Portfolio Totals</h3>
      {renderGreek("Delta", totals.dollar_delta)}
      {renderGreek("Gamma", totals.dollar_gamma)}
      {renderGreek("Vega", totals.dollar_vega)}
      {renderGreek("Theta", totals.dollar_theta)}
      {renderGreek("Rho", totals.dollar_rho)}
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

export default TotalsSection;