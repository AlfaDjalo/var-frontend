import React, { useState, useEffect } from "react";

export default function PortfolioPanel({
  assets,
  spotPrices,
  positions,
  editingId,  
  onAddPosition,
  onDeletePosition,
  onEditPosition,
  onUpdatePosition,
  onCancelEdit
}) {
  // Inputs for add position
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

  const handleAddPosition = () => {
    if (!newTicker || !newQuantity || isNaN(parseFloat(newQuantity))) {
      alert("Please enter valid ticker and quantity");
      return;
    }
    if (!assets.includes(newTicker)) {
      alert("Ticker not in dataset");
      return;
    }
    const qty = parseFloat(newQuantity);
    if (qty === 0) {
      alert("Quantity cannot be zero");
      return;
    }

    let position;

    if (addType === "stock") {
      position = {
        product_type: "stock",
        ticker: newTicker,
        quantity: qty,
      };
    } else {
      if (
        !newStrike ||
        isNaN(parseFloat(newStrike)) ||
        !newMaturity ||
        isNaN(parseFloat(newMaturity))
      ) {
        alert("Please enter valid strike and maturity for option");
        return;
      }
      position = {
        product_type: "option",
        underlying: newTicker,
        quantity: qty,
        strike: parseFloat(newStrike),
        option_type: newOptionType,
        maturity: parseFloat(newMaturity),
      };
    }

    onAddPosition(position);

    setNewTicker("");
    setNewQuantity("");
    setNewStrike("");
    setNewOptionType("call");
    setNewMaturity("");
  };

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

  return (
    <div>
      <h2>Portfolio Overview</h2>
      {positions.length === 0 ? (
        <p>No positions added yet.</p>
      ) : (
        <table border={1} cellPadding={8} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Strike</th>
              <th>Option Type</th>
              <th>Maturity (yrs)</th>
              <th>Spot Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => {
              const ticker =
                pos.product_type === "stock" ? pos.ticker : pos.underlying;
              const spot = spotPrices[ticker] || 0;
              return (
                <tr key={pos.id}>
                  <td>{ticker}</td>
                  <td>{pos.product_type}</td>
                  <td>{pos.quantity}</td>
                  <td>{pos.product_type === "option" ? pos.strike : "—"}</td>
                  <td>{pos.product_type === "option" ? pos.option_type : "—"}</td>
                  <td>{pos.product_type === "option" ? pos.maturity : "—"}</td>
                  <td>{spot.toFixed(2)}</td>
                  <td>
                    <button onClick={() => onEditPosition(pos.id)}>Edit</button>
                    <button onClick={() => onDeletePosition(pos.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <hr />

      <h3>{editingId ? "Edit Position" : "Add Position"}</h3>

      <div style={{ marginBottom: 10 }}>
        <label>
          <input
            type="radio"
            checked={addType === "stock"}
            onChange={() => setAddType("stock")}
          />
          Stock
        </label>
        <label style={{ marginLeft: 20 }}>
          <input
            type="radio"
            checked={addType === "option"}
            onChange={() => setAddType("option")}
          />
          Option
        </label>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>
          {addType === "stock" ? "Ticker:" : "Underlying:"}
          <select
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="">Select ticker</option>
            {/* {console.log("Assets: ", assets)} */}
            {assets.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>
          Quantity (positive = long, negative = short):
          <input
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            style={{ marginLeft: 8, width: 100 }}
          />
        </label>
      </div>

      {addType === "option" && (
        <>
          <div style={{ marginBottom: 10 }}>
            <label>
              Strike:
              <input
                type="number"
                value={newStrike}
                onChange={(e) => setNewStrike(e.target.value)}
                style={{ marginLeft: 8, width: 100 }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>
              Option Type:
              <select
                value={newOptionType}
                onChange={(e) => setNewOptionType(e.target.value)}
                style={{ marginLeft: 8 }}
              >
                <option value="call">Call</option>
                <option value="put">Put</option>
              </select>
            </label>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>
              Maturity (years):
              <input
                type="number"
                step="0.01"
                value={newMaturity}
                onChange={(e) => setNewMaturity(e.target.value)}
                style={{ marginLeft: 8, width: 100 }}
              />
            </label>
          </div>
        </>
      )}

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleSubmit}>
          {/* {editingId ? "Save Changes" : f"Add {addType === 'stock' ? 'Stock' : 'Option'}"} */}
          {editingId ? "Save Changes" : "Add Position"}
        </button>

        {editingId && (
          <button onClick={handleCancel} style={{ marginLeft: "10px" }}>
            Cancel Edit
          </button>
        )}
      </div>

      {/* <button onClick={handleAddPosition}>
        Add {addType === "stock" ? "Stock" : "Option"}
      </button> */}
    </div>
  );
}