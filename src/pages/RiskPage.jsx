import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { fetchRisk } from "../api/riskApi";
import TotalsSection from "../components/TotalsSection";
import PositionTable from "../components/PositionTable";
import FactorExposureTable from "../components/FactorExposureTable";

function RiskPage() {
  const { state, dispatch } = useApp();

  const positions = Object.values(state?.portfolio?.positions || {});
  const result = state?.risk?.result || null;
  const { loading, error } = state.ui;

  async function calculateRisk() {
    if (!positions.length) return;

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const response = await fetchRisk(state);
      dispatch({ type: "SET_RISK_RESULT", payload: response });
      console.log("Risk API response:", response);
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  useEffect(() => {
    if (positions.length && !result) {
      calculateRisk();
    }
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Portfolio Greeks</h2>

      {!positions.length && <p>No positions in portfolio.</p>}

      {loading && <p>Calculating risk...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && positions.length > 0 && (
        <button onClick={calculateRisk} style={{ marginBottom: 16 }}>
          Recalculate
        </button>
      )}

      {result && (
        <>
          <TotalsSection totals={result.totals} />
          <FactorExposureTable exposures={result.factor_exposures} />
          <PositionTable positions={result.positions} />
        </>
      )}
    </div>
  );
}

export default RiskPage;

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
