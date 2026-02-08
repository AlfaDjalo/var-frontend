export function buildVaRPayload(state) {
  const { data, portfolio, var: varState } = state;

  if (!data.datasetName) {
    throw new Error("Dataset not selected");
  }

  console.log("Positions: ", state.portfolio.positions)
  const productsArray = Object.entries(state.portfolio.positions).flatMap(
    ([key, pos], index) => {
        if (pos.product_type === "stock") {
            return {
                product_id: `${key}_${index}`,
                product_type: "stock",
                ticker: pos.ticker,
                quantity: pos.quantity,
            };
        } else if (pos.product_type === "option") {
            return {
                product_id: `${key}_${index}`,
                product_type: "equity_option",
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

//   const productsArray = Object.entries(portfolio.positions).map(
//     ([id, p]) => ({
//       id,
//       ...p,
//     })
//   );

  if (productsArray.length === 0) {
    throw new Error("Portfolio is empty");
  }

  const method = varState.method;
  const config = varState.config;

  /* -------- Base payload -------- */

  const payload = {
    dataset_name: data.datasetName,
    products: productsArray,
    confidence_level: config.confidenceLevel,
    estimation_window_days: config.estimationWindowDays,
    asof_date: config.asOfDate ?? null,
  };

  /* -------- Method-specific additions -------- */

  if (method === "montecarlo") {
    payload.n_sims = config.montecarlo.nSims;

    if (config.montecarlo.randomSeed != null) {
      payload.random_seed = config.montecarlo.randomSeed;
    }

    if (config.montecarlo.volOfVol != null) {
      payload.vol_of_vol = config.montecarlo.volOfVol / 100;
    }
  }

  if (method === "parametric") {
    payload.estimation_window_days =
      config.parametric.covWindowDays;
  }

  if (method === "histsim") {
    payload.estimation_window_days =
      config.histsim.histDataWindowDays;
  }

  console.log("Payload: ", payload)
  return payload;
}
