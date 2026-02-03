import React from "react";

const METHODS = [
  { key: "parametric", label: "Parametric (Var-Covar)", enabled: true },
  { key: "histsim", label: "Historical Simulation", enabled: true },
  { key: "montecarlo", label: "Monte Carlo", enabled: true },
];

const VaRMethodSelect = ({ value, onChange }) => {
    return (
        <div style={{ border: "1px solid #ccc", padding:16, maxWidth:500 }}>
            <h3>VaR Methodology</h3>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {METHODS.map((m) => (
                    <option
                        key={m.key}
                        value={m.key}
                        disabled={!m.enabled}
                    >
                        {m.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default VaRMethodSelect;
