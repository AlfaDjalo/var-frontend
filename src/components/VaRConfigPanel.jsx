import React from "react";

const VaRConfigPanel = ({
    varMethod,
    config,
    onChange,
}) => {
    const update = (key, value) => {
        onChange({
            ...config,
            [key]: value,
        });
    };

    return (
        <div style={{ border: "1px solid #ccc", padding: 16, maxWidth: 500 }}>
            <h3>VaR Configuration</h3>

            {/* Confidence level */}
            <div style={{ marginBottom: 12 }}>
                <label>
                    Confidence Level:&nbsp;
                    <select
                        value={config.confidenceLevel}
                        onChange={(e) =>
                            update("confidenceLevel", Number(e.target.value))
                        }
                    >
                        <option value={0.01}>99%</option>
                        <option value={0.025}>97.5%</option>
                        <option value={0.05}>95%</option>
                    </select>
                </label>
            </div>

            {/* Parametric-specific */}
            {varMethod === "parametric" && (
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Covariance Window (days)&nbsp;
                        <input
                            type="number"
                            min={20}
                            max={1000}
                            value={config.covWindowDays}
                            onChange={(e) =>
                                update("covWindowDays", Number(e.target.value))
                            }
                        />
                    </label>
                </div>
            )}

            {/* Historical Simulation-specific */}
            {varMethod === "histsim" && (
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Historical Window (days)&nbsp;
                        <input
                            type="number"
                            min={20}
                            max={1000}
                            value={config.histDataWindowDays}
                            onChange={(e) =>
                                update("histDataWindowDays", Number(e.target.value))
                            }
                        />
                    </label>
                </div>
            )}

            {/* Monte Carlo placeholder */}
            {varMethod === "montecarlo" && (
                <div style={{ fontStyle: "italic", color: "#666" }}>
                Monte Carlo parameters will appear here.
                </div>
            )}            

        </div>
    )
}

export default VaRConfigPanel;