import React from "react";
import { useApp } from "../context/AppContext";
import VaRResultPanel from "../components/VaRResultPanel";
import { buildVaRPayload } from "../utils/buildVaRPayload";

function VaRResultPage() {
  const { state, dispatch } = useApp();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const endpointByMethod = {
    parametric: "/parametric/calculate",
    histsim: "/histsim/calculate",
    montecarlo: "/montecarlo/calculate",
  };

  const calculateVaR = async () => {
    try {
      if (!state.data.datasetName) {
        dispatch({
          type: "SET_ERROR",
          payload: "Please load a dataset first.",
        });
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      /* -------- Build payload centrally -------- */
      const payload = buildVaRPayload(state);

      const res = await fetch(
        `${API_BASE_URL}${endpointByMethod[state.var.method]}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "VaR request failed");
      }

      const data = await res.json();

      /* -------- Normalize backend response -------- */
      dispatch({
        type: "SET_VAR_RESULT",
        payload: {
          portfolioValue: data.portfolio_value,
          varDollars: data.var_dollar,
          varPercent: data.var_percent,
          diagnostics: data.diagnostics ?? null,
        },
      });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err.message || "VaR calculation failed",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div>
      <h2>VaR Results</h2>

      <button onClick={calculateVaR} disabled={state.ui.loading}>
        {state.ui.loading ? "Running..." : "Run VaR"}
      </button>

      {state.ui.error && (
        <p style={{ color: "red" }}>{state.ui.error}</p>
      )}

      {state.var.result && (
        <VaRResultPanel
          varResult={state.var.result}
          varMethod={state.var.method}
          assets={state.data.assets}
        />
      )}
    </div>
  );
}

export default VaRResultPage;
