import React, { createContext, useReducer, useContext } from "react";

const AppContext = createContext();

const initialState = {
  datasetName: null,
  datasetSource: null,
  assets: [],
  spotPrices: {},
  positions: {},
  varMethod: "parametric",
  varConfig: {
    confidenceLevel: 0.01,
    covWindowDays: 252,
    histDataWindowDays: 252,
    parameterEstimationWindowDays: 252,
  },
  varResult: null,
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATASET":
      return {
        ...state,
        datasetName: action.payload.name,
        datasetSource: action.payload.source,
      };

    case "SET_MARKET_DATA":
      return {
        ...state,
        assets: action.payload.assets,
        spotPrices: action.payload.spotPrices,
        positions: {},
        // positions: action.payload.positions,
      };

    case "SET_POSITIONS":
      return { ...state, positions: action.payload };

    case "SET_VAR_METHOD":
      return { ...state, varMethod: action.payload };

    case "SET_VAR_CONFIG":
      return { ...state, varConfig: action.payload };

    case "SET_VAR_RESULT":
      return { ...state, varResult: action.payload };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "ADD_POSITION": {
      const { id, position } = action.payload;

      return {
        ...state,
        positions: {
          ...state.positions,
          [id]: position,
        },
      };
    }

    case "DELETE_POSITION": {
      const newPositions = { ...state.positions };
      delete newPositions[action.payload];

      return {
        ...state,
        positions: newPositions,
      };
    }

    case "SET_ERROR":
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

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
