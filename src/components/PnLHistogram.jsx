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


function niceNumber(x) {
  const exp = Math.floor(Math.log10(x));
  const f = x / Math.pow(10, exp);

  let nf;
  if (f <= 1) nf = 1;
  else if (f <= 2) nf = 2;
  else if (f <= 5) nf = 5;
  else nf = 10;

  return nf * Math.pow(10, exp);
}



function buildHistogram(data, targetBins = 30) {
  if (!data?.length) return [];

  const rawMin = Math.min(...data);
  const rawMax = Math.max(...data);

  if (rawMin == rawMax) return [];

  const range = rawMax - rawMin;

  const rawWidth = range / targetBins;
  const width = niceNumber(rawWidth);

  let niceMin = Math.floor(rawMin / width) * width;
  let niceMax = Math.ceil(rawMax / width) * width;

  if (niceMin < 0 && niceMax > 0) {
    niceMin = Math.floor(rawMin / width) * width;
    const binsBelowZero = Math.ceil(Math.abs(niceMin) / width);
    niceMin = -binsBelowZero * width;

    const binsAboveZero = Math.ceil(rawMax / width);
    niceMax = binsAboveZero * width;
  }

  const nBins = Math.round((niceMax - niceMin) / width);
  
  const bins = Array.from({ length: nBins }, (_, i) => ({
    start: niceMin + i * width,
    end: niceMin + (i + 1) * width,
    count: 0,
  }));

  data.forEach((x) => {
    let idx = Math.floor((x - niceMin) / width);
    if (idx < 0) idx = 0;
    if (idx >= nBins) idx = nBins - 1;
    bins[idx].count++;
  });

  const total = data.length;

  return bins.map((b) => ({
    mid: (b.start + b.end) / 2,
    probability: b.count / total,
  }));
}

function PnLHistogram({ pnls, varDollars }) {
  // Ned to link to number bins parameter
  const histData = useMemo(() => buildHistogram(pnls, 30), [pnls]);

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
            x={-varDollars}
            stroke="red"
            strokeWidth={2}
            label="VaR"
          />

          <Bar dataKey="probability">
            {histData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.mid <= -varDollars ? "#fca5a5" : "#8884d8"}
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PnLHistogram;
