import { buildVaRPayload } from "../api/buildVaRPayload";

const endpointByMethod = {
  parametric: "/parametric/calculate",
  histsim: "/histsim/calculate",
  montecarlo: "/montecarlo/calculate",
};

export async function runVaR(state, dispatch) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  try {
    if (!state.data?.datasetName) {
      throw new Error("Please load a dataset first.");
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    const payload = buildVaRPayload(state);
    console.log("VaR payload:", payload);

    const endpoint = endpointByMethod[state.var.method];
    if (!endpoint) {
      throw new Error(`Unknown VaR method: ${state.var.method}`);
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "VaR request failed");
    }

    const data = await res.json();
    console.log("VaR response:", data);

    /* ================= SAFE EXTRACTION ================= */

    const diagnostics = data?.diagnostics ?? {};
    const attribution = diagnostics?.attribution ?? {};

    const rawScenarios =
      diagnostics?.var_scenarios ??
      data?.var_scenarios ??
      diagnostics?.selected ??
      [];
      
      /* ================= NORMALIZED RESULT ================= */
      const rawAttr = diagnostics.attribution ?? {};

    const normalizedResult = {
      /* ---- Core VaR ---- */
      portfolioValue: data?.portfolio_value ?? 0,
      varDollars: data?.var_dollar ?? 0,
      varPercent: data?.var_percent ?? 0,

      /* ---- Diagnostics ---- */
      diagnostics,

      scenarios: {
        varIndex: diagnostics?.var_index ?? null,
        pnls: diagnostics?.pnls ?? [],
        selected: rawScenarios,
      },

      distribution: diagnostics?.distribution ?? null,
      tail: diagnostics?.tail ?? null,
      metadata: diagnostics?.metadata ?? null,

      /* ---- Attribution (if provided) ---- */
      attribution: {
        positions: rawAttr.positions ?? {},
        portfolio: rawAttr.portfolio ?? {},
      },

      // attribution: {
      //   positions: attribution?.component_var_positions ?? {},
      //   factors: attribution?.component_var_factors ?? {},
      //   marginal: attribution?.marginal_var ?? {},
      // },

      /* ---- Greeks / Risk Totals (if backend sends them) ---- */
      totals: {
        delta: data?.totals?.delta ?? 0,
        dollar_delta: data?.totals?.dollar_delta ?? 0,
        dv01: data?.totals?.dv01 ?? 0,
      },

      /* ---- Per-position risk (optional) ---- */
      positions: Array.isArray(data?.positions)
        ? data.positions.map((pos) => ({
            id: pos?.id ?? "unknown",
            delta: pos?.delta ?? 0,
            dollar_delta: pos?.dollar_delta ?? 0,
            dv01: pos?.dv01 ?? 0,
            bucketed_dv01: pos?.bucketed_dv01 ?? null,
            factor_exposures: pos?.factor_exposures ?? {},
          }))
        : [],

      /* ---- Factor totals (optional) ---- */
      factors: data?.factors ?? {},
    };

    dispatch({
      type: "SET_VAR_RESULT",
      payload: normalizedResult,
    });

  } catch (err) {
    dispatch({
      type: "SET_ERROR",
      payload: err?.message || "VaR calculation failed",
    });
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
}
