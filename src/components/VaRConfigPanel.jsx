import React from "react";

function VaRConfigPanel({ varMethod, config, onChange }) {
  if (!config) {
    return <div>Loading VaR config...</div>;
  }

  /* ---------- Helpers ---------- */

  const updateGlobal = (key, value) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  const updateMethod = (values) => {
    onChange({
      ...config,
      [varMethod]: {
        ...config[varMethod],
        ...values,
      },
    });
  };

  /* ---------- UI ---------- */

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, maxWidth: 500 }}>
      <h3>VaR Configuration</h3>

      {/* ===== Global ===== */}

      <div style={{ marginBottom: 12 }}>
        <label>
          Confidence Level:&nbsp;
          <select
            value={config.confidenceLevel}
            onChange={(e) =>
              updateGlobal(
                "confidenceLevel",
                Number(e.target.value)
              )
            }
          >
            <option value={0.01}>99%</option>
            <option value={0.025}>97.5%</option>
            <option value={0.05}>95%</option>
          </select>
        </label>
      </div>

      {/* ===== Parametric ===== */}

      {varMethod === "parametric" && (
        <div style={{ marginBottom: 12 }}>
          <label>
            Covariance Window (days):&nbsp;
            <input
              type="number"
              min={20}
              max={2000}
              value={config.parametric.covWindowDays}
              onChange={(e) =>
                updateMethod({
                  covWindowDays: Number(e.target.value),
                })
              }
            />
          </label>
        </div>
      )}

      {/* ===== HistSim ===== */}

      {varMethod === "histsim" && (
        <div style={{ marginBottom: 12 }}>
          <label>
            Historical Window (days):&nbsp;
            <input
              type="number"
              min={20}
              max={2000}
              value={config.histsim.histDataWindowDays}
              onChange={(e) =>
                updateMethod({
                  histDataWindowDays: Number(e.target.value),
                })
              }
            />
          </label>
        </div>
      )}

      {/* ===== Monte Carlo ===== */}

      {varMethod === "montecarlo" && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label>
              Number of Simulations:&nbsp;
              <input
                type="number"
                min={100}
                step={100}
                value={config.montecarlo.nSims}
                onChange={(e) =>
                  updateMethod({
                    nSims: Number(e.target.value),
                  })
                }
              />
            </label>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>
              Random Seed (optional):&nbsp;
              <input
                type="number"
                value={config.montecarlo.randomSeed ?? ""}
                onChange={(e) =>
                  updateMethod({
                    randomSeed:
                      e.target.value === ""
                        ? null
                        : Number(e.target.value),
                  })
                }
              />
            </label>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>
              Vol of Vol (optional):&nbsp;
              <input
                type="number"
                value={config.montecarlo.volOfVol ?? ""}
                onChange={(e) =>
                  updateMethod({
                    volOfVol:
                      e.target.value === ""
                        ? null
                        : Number(e.target.value),
                  })
                }
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}

export default VaRConfigPanel;
