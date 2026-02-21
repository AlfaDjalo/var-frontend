import { buildProductsPayload } from "./buildProductsPayload";

export async function fetchRisk(state) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const products = buildProductsPayload(state.portfolio.positions);

  const payload = {
    dataset_name: state.data.datasetName,
    products: products,
    asof_date: state.var.config.asOfDate ?? null,
  };

  const response = await fetch(`${API_BASE_URL}/greeks/calculate`, {
//   const response = await fetch("api/greeks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Risk calculation failed");
  }

  if (!response.ok) {
    throw new Error("Risk calculation failed");
  }

  return response.json();
}
