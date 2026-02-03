import React from "react";
import { useApp } from "../context/AppContext";
import VaRResultPanel from "../components/VaRResultPanel";

function VaRResultPage() {
  const { state, dispatch } = useApp();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const endpointByMethod = {
    parametric: "/parametric/calculate",
    histsim: "/histsim/calculate",
    montecarlo: "/montecarlo/calculate",
  };

  const calculateVaR = async () => {
    if (!state.datasetName) {
      dispatch({ type: "SET_ERROR", payload: "Please load a dataset first." });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    const productsArray = Object.entries(state.positions).flatMap(
      ([key, pos], index) => {
        if (pos.product_type === "stock") {
          return {
            product_id: `${key}_${index}`,
            product_type: "stock",
            ticker: pos.ticker,
            quantity: pos.quantity,
          };
        } else if (pos.product_type === "equity_option") {
          return {
            product_id: `${key}_${index}`,
            product_type: "option",
            underlying_ticker: pos.underlying,
            quantity: pos.quantity,
            strike: pos.strike,
            option_type: pos.option_type,
            maturity: pos.maturity,            
          };
        }
        return [];
      }
    );

    const payload = {
      dataset_name: state.datasetName,
      confidence_level: state.varConfig.confidenceLevel,
      estimation_window_days:
        state.varMethod === "histsim"
          ? state.varConfig.histDataWindowDays
          : state.varMethod === "parametric"
          ? state.varConfig.covWindowDays
          : state.varConfig.parameterEstimationWindowDays,
      asof_date: "2026-01-25",
      products: productsArray,
    };

    try {
      const res = await fetch(
        `${API_BASE_URL}${endpointByMethod[state.varMethod]}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      dispatch({
        type: "SET_VAR_RESULT",
        payload: {
          portfolioValue: data.portfolio_value,
          varDollars: data.var_dollar,
          varPercent: data.var_percent,
          volatilityPercent: data.volatility_percent,
          correlation_matrix: data.correlation_matrix,
        },
      });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "VaR calculation failed" });
    }

    dispatch({ type: "SET_LOADING", payload: false });
  };

  return (
    <div>
      <h2>VaR Results</h2>

      <button onClick={calculateVaR} disabled={state.loading}>
        {state.loading ? "Running..." : "Run VaR"}
      </button>

      {state.error && <p style={{ color: "red" }}>{state.error}</p>}

      {state.varResult && (
        <VaRResultPanel
          varResult={state.varResult}
          varMethod={state.varMethod}
          assets={state.assets}
        />
        // <div>
        //   <p>Portfolio Value: {state.varResult.portfolioValue}</p>
        //   <p>VaR ($): {state.varResult.varDollars}</p>
        //   <p>VaR (%): {state.varResult.varPercent}</p>
        //   <p>Volatility (%): {state.varResult.volatilityPercent}</p>
        // </div>
      )}
    </div>
  );
}

export default VaRResultPage;
