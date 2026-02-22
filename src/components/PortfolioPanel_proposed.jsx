import React, { useState, useEffect } from "react";

export default function PortfolioPanel({
  assets = [],
  spotPrices = {},
  positions = [],
  editingId,
  onAddPosition,
  onDeletePosition,
  onEditPosition,
  onUpdatePosition,
  onCancelEdit
}) {
  const [addType, setAddType] = useState("stock");
  const [newTicker, setNewTicker] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newStrike, setNewStrike] = useState("");
  const [newOptionType, setNewOptionType] = useState("call");
  const [newMaturity, setNewMaturity] = useState("");

  // 🔥 Populate form when editing
  useEffect(() => {
    if (!editingId) return;

    const position = positions.find(p => p.id === editingId);
    if (!position) return;

    setAddType(position.product_type);
    setNewQuantity(position.quantity);

    if (position.product_type === "stock") {
      setNewTicker(position.ticker);
      setNewStrike("");
      setNewMaturity("");
    } else {
      setNewTicker(position.underlying);
      setNewStrike(position.strike);
      setNewOptionType(position.option_type);
      setNewMaturity(position.maturity);
    }
  }, [editingId, positions]);

  const resetForm = () => {
    setNewTicker("");
    setNewQuantity("");
    setNewStrike("");
    setNewOptionType("call");
    setNewMaturity("");
  };

  const buildPosition = () => {
    if (!newTicker || !newQuantity) return null;

    const qty = parseFloat(newQuantity);
    if (isNaN(qty) || qty === 0) return null;

    if (addType === "stock") {
      return {
        product_type: "stock",
        ticker: newTicker,
        quantity: qty
      };
    }

    return {
      product_type: "option",
      underlying: newTicker,
      quantity: qty,
      strike: parseFloat(newStrike),
      option_type: newOptionType,
      maturity: parseFloat(newMaturity)
    };
  };

  const handleSubmit = () => {
    const position = buildPosition();
    if (!position) return;

    if (editingId) {
      onUpdatePosition(editingId, position);
    } else {
      onAddPosition(position);
    }

    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit();
  };

  const currentSpot = newTicker ? spotPrices[newTicker] : null;

  return (
    <div>
      <h2>Portfolio</h2>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Type</th>
            <th>Ticker</th>
            <th>Qty</th>
            <th>Strike</th>
            <th>Option</th>
            <th>Maturity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(pos => (
            <tr
              key={pos.id}
              style={{
                backgroundColor:
                  pos.id === editingId ? "#ffeeba" : "transparent"
              }}
            >
              <td>{pos.product_type}</td>
              <td>{pos.ticker || pos.underlying}</td>
              <td>{pos.quantity}</td>
              <td>{pos.strike || "-"}</td>
              <td>{pos.option_type || "-"}</td>
              <td>{pos.maturity || "-"}</td>
              <td>
                <button onClick={() => onEditPosition(pos.id)}>
                  Edit
                </button>
                <button onClick={() => onDeletePosition(pos.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h3>{editingId ? "Edit Position" : "Add Position"}</h3>

      <div>

        <select
          value={addType}
          onChange={(e) => setAddType(e.target.value)}
          disabled={!!editingId}
        >
          <option value="stock">Stock</option>
          <option value="option">Option</option>
        </select>

        {/* ✅ Restored dropdown */}
        <select
          value={newTicker}
          onChange={(e) => setNewTicker(e.target.value)}
        >
          <option value="">Select Ticker</option>
          {assets.map(asset => (
            <option key={asset} value={asset}>
              {asset}
            </option>
          ))}
        </select>

        {/* ✅ Restored spot display */}
        {currentSpot && (
          <span style={{ marginLeft: "10px" }}>
            Spot: {currentSpot.toFixed(2)}
          </span>
        )}

        <input
          placeholder="Quantity"
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
        />

        {addType === "option" && (
          <>
            <input
              placeholder="Strike"
              value={newStrike}
              onChange={(e) => setNewStrike(e.target.value)}
            />

            <select
              value={newOptionType}
              onChange={(e) => setNewOptionType(e.target.value)}
            >
              <option value="call">Call</option>
              <option value="put">Put</option>
            </select>

            <input
              placeholder="Maturity (years)"
              value={newMaturity}
              onChange={(e) => setNewMaturity(e.target.value)}
            />
          </>
        )}
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleSubmit}>
          {editingId ? "Save Changes" : "Add Position"}
        </button>

        {editingId && (
          <button onClick={handleCancel} style={{ marginLeft: "10px" }}>
            Cancel Edit
          </button>
        )}
      </div>
    </div>
  );
}
