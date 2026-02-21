import { buildProductsPayload } from "./buildProductsPayload";

export function buildVaRPayload(state) {
  const { data, portfolio, var: varState } = state;

  if (!data.datasetName) {
    throw new Error("Dataset not selected");
  }

  const productsArray = buildProductsPayload(portfolio.positions);

  if (productsArray.length === 0) {
    throw new Error("Portfolio is empty");
  }

  const method = varState.method;
  const config = varState.config;

  const payload = {
    dataset_name: data.datasetName,
    products: productsArray,
    confidence_level: config.confidenceLevel,
    asof_date: config.asOfDate ?? null,
    factors: {
      spot: data.spotPrices ?? {},
      rates: data.rates ?? {},
      vols: data.vols ?? {},
    },    
  };

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

  return payload;
}
