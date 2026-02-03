import React from "react";
import PortfolioPanel from "../components/PortfolioPanel";

export default function PortfolioPage({ assets, positions, setPositions, spotPrices }) {
  return (
    <PortfolioPanel
      assets={assets}
      positions={positions}
      setPositions={setPositions}
      spotPrices={spotPrices}
    />
  );
}
