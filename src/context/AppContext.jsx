import React, { createContext, useReducer, useContext } from "react";

const AppContext = createContext();

/* ================= INITIAL STATE ================= */

const initialState = {
  /* -------- Data domain -------- */
  data: {
    datasetName: null,
    datasetSource: null,
    assets: [],
    spotPrices: {},
  },

  /* -------- Portfolio domain -------- */
  portfolio: {
    positions: {},
  },

  /* -------- VaR domain -------- */
  var: {
    method: "parametric",

    config: {
      confidenceLevel: 0.01,

      parametric: {
        covWindowDays: 252,
      },

      histsim: {
        histDataWindowDays: 252,
      },

      montecarlo: {
        nSims: 10000,
        randomSeed: null,
        volOfVol: null,
      },
    },

    result: null,
  },

  /* -------- UI domain -------- */
  ui: {
    loading: false,
    error: null,
  },
};

/* ================= REDUCER ================= */

function reducer(state, action) {
  switch (action.type) {
    /* ---------- DATA ---------- */

    case "SET_DATASET":
      return {
        ...state,
        data: {
          ...state.data,
          datasetName: action.payload.name,
          datasetSource: action.payload.source,
        },
        var: {
          ...state.var,
          result: null, // dataset change invalidates VaR
        },
      };

    case "SET_MARKET_DATA":
      return {
        ...state,
        data: {
          ...state.data,
          assets: action.payload.assets,
          spotPrices: action.payload.spotPrices,
        },
        portfolio: {
          positions: {}, // reset portfolio on new dataset
        },
        var: {
          ...state.var,
          result: null, // new market data invalidates VaR
        },
      };

    /* ---------- PORTFOLIO ---------- */

    case "ADD_POSITION": {
      const { id, position } = action.payload;

      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          positions: {
            ...state.portfolio.positions,
            [id]: position,
          },
        },
        var: {
          ...state.var,
          result: null, // portfolio change invalidates VaR
        },
      };
    }

    case "DELETE_POSITION": {
      const copy = { ...state.portfolio.positions };
      delete copy[action.payload];

      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          positions: copy,
        },
        var: {
          ...state.var,
          result: null,
        },
      };
    }

    case "SET_POSITIONS":
      return {
        ...state,
        portfolio: {
          positions: action.payload,
        },
        var: {
          ...state.var,
          result: null,
        },
      };

    /* ---------- VAR ---------- */

    case "SET_VAR_METHOD":
      return {
        ...state,
        var: {
          ...state.var,
          method: action.payload,
          result: null,
        },
      };

    case "UPDATE_VAR_CONFIG":
      return {
        ...state,
        var: {
          ...state.var,
          config: {
            ...state.var.config,
            ...action.payload,
          },
          result: null,
        },
      };

    case "UPDATE_METHOD_CONFIG": {
      const { method, values } = action.payload;

      return {
        ...state,
        var: {
          ...state.var,
          config: {
            ...state.var.config,
            [method]: {
              ...state.var.config[method],
              ...values,
            },
          },
          result: null,
        },
      };
    }

    case "SET_VAR_RESULT":
      return {
        ...state,
        var: {
          ...state.var,
          result: action.payload,
        },
      };

    /* ---------- UI ---------- */

    case "SET_LOADING":
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: action.payload,
        },
      };

    case "SET_ERROR":
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.payload,
        },
      };

    default:
      return state;
  }
}

/* ================= PROVIDER ================= */

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
