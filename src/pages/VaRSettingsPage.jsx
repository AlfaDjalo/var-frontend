import React from "react";
import VaRMethodSelect from "../components/VaRMethodSelect";
import VaRConfigPanel from "../components/VaRConfigPanel";

export default function VaRSettingsPage({ varMethod, setVarMethod, varConfig, setVarConfig, setVarResult }) {
  return (
    <div>
      <VaRMethodSelect
        value={varMethod}
        onChange={(method) => {
          setVarMethod(method);
          setVarResult(null);
        }}
      />
      <VaRConfigPanel
        varMethod={varMethod}
        config={varConfig}
        onChange={(newConfig) => {
          setVarConfig(newConfig);
          setVarResult(null);
        }}
      />
    </div>
  );
}
