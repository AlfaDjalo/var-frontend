import React from "react";
import CorrelationMatrix from "./CorrelationMatrix";

const VaRResultPanel = ({ varResult, varMethod, assets }) => {
    if (!varResult) {
        return <div>No VaR results available.</div>;
    }

    const {
        portfolioValue,
        varDollars,
        varPercent,
        volatilityPercent,
        correlation_matrix,
        scenarios,
    } = varResult;

    if (
        portfolioValue == null ||
        varDollars == null ||
        varPercent == null
    ) {
        return <div>No VaR results available.</div>;
    }

    return (
        <div
            style={{
                border: "1px solid #ccc",
                padding: 16,
                marginTop: 24,
            }}
        >
            <h3>VaR Results</h3>

            {/* ================= Summary ================= */}
            <div style={{ marginBottom: 20 }}>
                <p>
                    <strong>Portfolio value:</strong>{" "}
                    ${portfolioValue.toFixed(2)}
                </p>

                <p>
                    <strong>VaR ($): </strong>{" "}
                    ${varDollars.toFixed(2)}
                </p>

                <p>
                    <strong>VaR (%): </strong>{" "}
                    {(varPercent*100).toFixed(2)}%
                </p>

                {volatilityPercent != null && (
                    <p>
                        <strong>Volatility (%): </strong>{" "}
                        {(volatilityPercent * 100).toFixed(2)}%
                    </p>                    
                )}
            </div>

            {/* ================= Correlation ================= */}
            {correlation_matrix && assets?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                    <h4>Correlation Matrix</h4>
                    <CorrelationMatrix
                        corrMatrix={correlation_matrix}
                        tickers={assets}
                    />
                </div>
            )}

            {/* ================= Hist Sim Scenarios (future) ================= */}
            {varMethod === "histsim" && scenarios && (
                <div>
                    <h4>Worst Scenarios</h4>

                    <table
                        style={{
                            borderCollapse: "collapse",
                            width: "100%",
                            marginTop: 8,
                        }}
                    >
                        <thead>
                        <tr>
                            <th style={thStyle}>Rank</th>
                            <th style={thStyle}>Portfolio P&amp;L</th>
                            <th style={thStyle}>Details</th>
                        </tr>
                        </thead>
                        <tbody>
                        {scenarios.map((s) => (
                            <tr
                            key={s.rank}
                            style={{
                                backgroundColor: s.isVarScenario
                                ? "#ffecec"
                                : "transparent",
                            }}
                            >
                            <td style={tdStyle}>{s.rank}</td>
                            <td style={tdStyle}>
                                ${s.portfolioPnl.toFixed(2)}
                            </td>
                            <td style={tdStyle}>
                                {s.assetPnls
                                ? "Asset breakdown available"
                                : "—"}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div style={{ fontStyle: "italic", marginTop:6 }}>
                        VaR scenario highlighted
                    </div>
                </div>
            )}
        </div>
    );
};

const thStyle = {
    borderBottom: "1px solid #ccc",
    textAlign: "left",
    padding: 6,
};

const tdStyle = {
    borderBottom: "1px solid #eee",
    padding: 6,
};

export default VaRResultPanel;