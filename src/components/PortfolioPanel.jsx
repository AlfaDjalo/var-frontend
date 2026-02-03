import React, { useState, useEffect } from "react";

export default function PortfolioPanel({ assets, spotPrices }) {
  // Positions is an array of position objects (stock and option)
  const [positions, setPositions] = useState([]);

  // Inputs for add position
  const [addType, setAddType] = useState("stock");
  const [newTicker, setNewTicker] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newStrike, setNewStrike] = useState("");
  const [newOptionType, setNewOptionType] = useState("call");
  const [newMaturity, setNewMaturity] = useState("");

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

    if (addType === "stock") {
      setPositions((prev) => [
        ...prev,
        {
          product_type: "stock",
          ticker: newTicker,
          quantity: qty,
        },
      ]);
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
      setPositions((prev) => [
        ...prev,
        {
          product_type: "option",
          underlying: newTicker,
          quantity: qty,
          strike: parseFloat(newStrike),
          option_type: newOptionType,
          maturity: parseFloat(newMaturity),
        },
      ]);
    }

    setNewTicker("");
    setNewQuantity("");
    setNewStrike("");
    setNewOptionType("call");
    setNewMaturity("");
  };

  const handleDeletePosition = (idx) => {
    setPositions((prev) => prev.filter((_, i) => i !== idx));
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
            {positions.map((pos, idx) => {
              const ticker = pos.product_type === "stock" ? pos.ticker : pos.underlying;
              const spot = spotPrices[ticker] || 0;
              return (
                <tr key={idx}>
                  <td>{ticker}</td>
                  <td>{pos.product_type}</td>
                  <td>{pos.quantity}</td>
                  <td>{pos.product_type === "option" ? pos.strike : "—"}</td>
                  <td>{pos.product_type === "option" ? pos.option_type : "—"}</td>
                  <td>{pos.product_type === "option" ? pos.maturity : "—"}</td>
                  <td>{spot.toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleDeletePosition(idx)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <hr />

      <h2>Add Position</h2>
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

      <button onClick={handleAddPosition}>Add {addType === "stock" ? "Stock" : "Option"}</button>
    </div>
  );
}
