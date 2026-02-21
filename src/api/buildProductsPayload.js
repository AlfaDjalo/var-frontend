export function buildProductsPayload(positions) {
  return Object.entries(positions).flatMap(
    ([key, pos], index) => {
      if (pos.product_type === "stock") {
        return {
          product_id: key,
        //   product_id: `${key}_${index}`,
          product_type: "stock",
          ticker: pos.ticker,
          quantity: pos.quantity,
          factors: pos.factors ?? {},
        };
      }

      if (pos.product_type === "option") {
        return {
          product_id: key,
        //   product_id: `${key}_${index}`,
          product_type: "equity_option",
          underlying_ticker: pos.underlying,
          quantity: pos.quantity,
          strike: pos.strike,
          option_type: pos.option_type,
          maturity: pos.maturity,
          factors: pos.factors ?? {},
        };
      }

      return [];
    }
  );
}
