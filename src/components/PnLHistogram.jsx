import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

import "../styles/varResults.css";

function buildHistogram(data, nBins = 30) {
  if (!data?.length) return [];

  const min = Math.min(...data);
  const max = Math.max(...data);
  const width = (max - min) / nBins;

  const bins = Array.from({ length: nBins }, (_, i) => ({
    start: min + i * width,
    end: min + (i + 1) * width,
    count: 0,
  }));

  data.forEach((x) => {
    let idx = Math.floor((x - min) / width);
    if (idx === nBins) idx = nBins - 1;
    bins[idx].count++;
  });

  const total = data.length;

  return bins.map((b) => ({
    mid: (b.start + b.end) / 2,
    probability: b.count / total,
  }));
}

function PnLHistogram({ pnls, varDollars }) {
  const histData = useMemo(() => buildHistogram(pnls), [pnls]);

  if (!pnls?.length) return null;

  return (
    <div className="histogram-container">
      <h3 className="histogram-title">PnL Distribution</h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={histData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="mid"
            tickFormatter={(v) => v.toFixed(0)}
            label={{ value: "PnL", position: "insideBottom", offset: -5 }}
          />

          <YAxis
            tickFormatter={(v) => (v * 100).toFixed(1) + "%"}
            label={{
              value: "Probability",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <Tooltip
            formatter={(v) => (v * 100).toFixed(2) + "%"}
          />

          <ReferenceLine
            x={varDollars}
            stroke="red"
            strokeWidth={2}
            label="VaR"
          />

          <Bar dataKey="probability">
            {histData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.mid <= varDollars ? "#fca5a5" : "#8884d8"}
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PnLHistogram;
