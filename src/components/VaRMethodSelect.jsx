import React from "react";
import { useApp } from "../context/AppContext";

const METHODS = [
  { key: "parametric", label: "Parametric (Var-Covar)" },
  { key: "histsim", label: "Historical Simulation" },
  { key: "montecarlo", label: "Monte Carlo" },
];

const VaRMethodSelect = ({ value, onChange }) => {
  const { state, dispatch } = useApp();

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, maxWidth: 500 }}>
      <h3>VaR Methodology</h3>

      <select
        value={value}
        // value={state.var.method}
        onChange={(e) => onChange(e.target.value)}
        // onChange={(e) =>
        //   dispatch({
        //     type: "SET_VAR_METHOD",
        //     payload: e.target.value,
        //   })
        // }
      >
        {METHODS.map((m) => (
          <option key={m.key} value={m.key}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VaRMethodSelect;
