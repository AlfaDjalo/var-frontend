import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

import VaRMethodSelect from "../components/VaRMethodSelect";
import VaRConfigPanel from "../components/VaRConfigPanel";

function VaRSettingsPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [localVarMethod, setLocalVarMethod] = useState(state.var.method);
  const [localVarConfig, setLocalVarConfig] = useState(state.var.config);

  useEffect(() => {
    setLocalVarMethod(state.var.method);
    setLocalVarConfig(state.var.config);
  }, [state.var.method, state.var.config]);

  
  const onSaveAndExit = () => {
    dispatch({ type: "SET_VAR_METHOD", payload: localVarMethod });
    dispatch({ type: "UPDATE_VAR_CONFIG", payload: localVarConfig });
    dispatch({ type: "SET_VAR_RESULT", payload: null });
    navigate("/");
  };
  
  const onCancelChanges = () => {
    // setLocalVarMethod(state.var.method);
    // setLocalVarConfig(state.var.config);
    navigate("/");
  };
  
  // const handleMethodChange = (method) => {
  //   setLocalVarMethod(method);
  // };

  // const handleConfigChange = (newConfig) => {
  //   setLocalVarConfig(newConfig);
  // };

  // // Optional: track if changes made to enable/disable Save button
  // const hasChanges =
  // localVarMethod !== state.var.method ||
  // JSON.stringify(localVarConfig) !== JSON.stringify(state.var.config);

  return (
    <div>
      <VaRMethodSelect 
        value={localVarMethod}
        onChange={setLocalVarMethod}
      />
      {/* <VaRMethodSelect value={localVarMethod} onChange={handleMethodChange} /> */}
      <VaRConfigPanel
        varMethod={localVarMethod}
        config={localVarConfig}
        onChange={setLocalVarConfig}
        // onChange={handleConfigChange}
      />

      <div className="button-row">
        <button
          className="btn btn-primary"
          onClick={onSaveAndExit}
          // disabled={!hasChanges}
        >
          Save and Exit
        </button>
        <button className="btn btn-secondary" onClick={onCancelChanges}>
          Cancel Changes
        </button>
      </div>
    </div>
  );
}

export default VaRSettingsPage;
