import { buildVaRPayload } from "../utils/buildVaRPayload";

const endpointByMethod = {
  parametric: "/parametric/calculate",
  histsim: "/histsim/calculate",
  montecarlo: "/montecarlo/calculate",
};

export async function runVaR(state, dispatch) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  try {
    if (!state.data.datasetName) {
      throw new Error("Please load a dataset first.");
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

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
}
