import React from "react";
import { useApp } from "../context/AppContext";
import VaRMethodSelect from "../components/VaRMethodSelect";
import VaRConfigPanel from "../components/VaRConfigPanel";

// export default function VaRSettingsPage({ varMethod, setVarMethod, varConfig, setVarConfig, setVarResult }) {
function VaRSettingsPage() {
  const { state, dispatch } = useApp();
  const { varMethod, varConfig } = state;

  const handleMethodChange = (method) => {
    dispatch({
      type: "SET_VAR_METHOD",
      payload: method,
    });
  };

  const handleConfigChange = (newConfig) => {
    dispatch({
      type: "SET_VAR_CONFIG",
      payload: newConfig,
    });
  };

  return (
    <div>
      <VaRMethodSelect
        value={varMethod}
        onChange={handleMethodChange}
        // onChange={(method) => {
        //   setVarMethod(method);
        //   setVarResult(null);
        // }}
      />
      <VaRConfigPanel
        varMethod={varMethod}
        config={varConfig}
        onChange={handleConfigChange}
        // onChange={(newConfig) => {
        //   setVarConfig(newConfig);
        //   setVarResult(null);
        // }}
      />
    </div>
  );
}

export default VaRSettingsPage;
