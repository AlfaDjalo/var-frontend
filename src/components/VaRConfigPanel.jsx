import React from "react";
import { useApp } from "../context/AppContext";

function VaRConfigPanel() {
  const { state, dispatch } = useApp();

    if (!state?.var?.config) {
        return <div>Loading VaR config...</div>;
    }

  const method = state.var.method;
  const config = state.var.config;

  /* ---------- Helpers ---------- */

  const updateGlobal = (key, value) => {
    dispatch({
      type: "UPDATE_VAR_CONFIG",
      payload: { [key]: value },
    });
  };

  const updateMethod = (values) => {
    dispatch({
      type: "UPDATE_METHOD_CONFIG",
      payload: {
        method,
        values,
      },
    });
  };

  /* ---------- UI ---------- */

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, maxWidth: 500 }}>
      <h3>VaR Configuration</h3>

      {/* ================= Global ================= */}

      <div style={{ marginBottom: 12 }}>
        <label>
          Confidence Level:&nbsp;
          <select
            value={config.confidenceLevel}
            onChange={(e) =>
              updateGlobal("confidenceLevel", Number(e.target.value))
            }
          >
            <option value={0.01}>99%</option>
            <option value={0.025}>97.5%</option>
            <option value={0.05}>95%</option>
          </select>
        </label>
      </div>

      {/* <div style={{ marginBottom: 12 }}>
        <label>
          Estimation Window (days):&nbsp;
          <input
            type="number"
            min={20}
            max={2000}
            value={config.estimationWindowDays}
            onChange={(e) =>
              updateGlobal("estimationWindowDays", Number(e.target.value))
            }
          />
        </label>
      </div> */}

      {/* ================= Parametric ================= */}

      {method === "parametric" && (
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

      {/* ================= HistSim ================= */}

      {method === "histsim" && (
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

      {/* ================= Monte Carlo ================= */}

      {method === "montecarlo" && (
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
        </>
      )}
    </div>
  );
}

export default VaRConfigPanel;
