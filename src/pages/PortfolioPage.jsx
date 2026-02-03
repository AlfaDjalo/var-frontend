import React from "react";
import { useApp } from "../context/AppContext";
import PortfolioPanel from "../components/PortfolioPanel";

function PortfolioPage() {
  const { state, dispatch } = useApp();
  const { assets, spotPrices, positions } = state;
  
  // const [addType, setAddType] = useState("stock");
  // const [newTicker, setNewTicker] = useState("");
  // const [newQuantity, setNewQuantity] = useState("");
  // const [newStrike, setNewStrike] = useState("");
  // const [newOptionType, setNewOptionType] = useState("call");
  // const [newMaturity, setNewMaturity] = useState("");
  
  // const positionsArray = Object.entries(positions);
  const positionsArray = Object.entries(positions).map(([id, pos]) => ({
    ...pos,
    id,
  }));
  
  const handleAddPosition = (position) => {
    const id = crypto.randomUUID();
    dispatch({ type: "ADD_POSITION", payload: { id, position } });
  };
  
  const handleDeletePosition = (id) => {
    dispatch({ type: "DELETE_POSITION", payload: id });
  };

  const handleSavePortfolio = async () => {
    const dataToSave = JSON.stringify(positions, null, 2);
    
    if (window.showSaveFilePicker) {
      try {
        const options = {
          types: [
            {
              description: "JSON Files",
              accept: { "application/json": [".json"] },
            },
          ],
          suggestedName: "portfolio.json",
        };

        const handle = await window.showSaveFilePicker(options);
        const writable = await handle.createWritable();
        await writable.write(dataToSave);
        await writable.close();
        alert("Portfolio saved successfully");
        return;
      } catch (err) {
        console.warn("Save failed or cancelled:", err);
      }
    }

    const filename = prompt("Enter filename", "portfolio.json") || "portfolio.json";
    
    const blob = new Blob([dataToSave], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleLoadPortfolio = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loadedPositions = JSON.parse(event.target.result);

        if (
          typeof loadedPositions === "object" &&
          loadedPositions !== null &&
          !Array.isArray(loadedPositions)
        ) {
          dispatch({ type: "SET_POSITIONS", payload: loadedPositions });
        } else {
          alert("Invalid portfolio file format.");
        } 
      } catch {
          alert("Error parsing portfolio file.");
        }
      };

      reader.readAsText(file);
      e.target.value = null;
    };
  // }
  // const handleAddPosition = () => {
  //   if (!newTicker || !newQuantity || isNaN(parseFloat(newQuantity))) {
  //     alert("Enter valid ticker and quantity");
  //     return;
  //   }

  //   if (!assets.includes(newTicker)) {
  //     alert("Ticker not in dataset");
  //     return;
  //   }

  //   const qty = parseFloat(newQuantity);
  //   if (qty === 0) {
  //     alert("Quantity cannot be zero");
  //     return;
  //   }

  //   let position;

  //   if (addType === "stock") {
  //     position = {
  //       product_type: "stock",
  //       ticker: newTicker,
  //       quantity: qty,
  //     };
  //   } else {
  //     if (
  //       !newStrike ||
  //       !newMaturity ||
  //       isNaN(parseFloat(newStrike)) ||
  //       isNaN(parseFloat(newMaturity))
  //     ) {
  //       alert("Enter valid strike & maturity");
  //       return;
  //     }

  //     position = {
  //       product_type: "option",
  //       underlying: newTicker,
  //       quantity: qty,
  //       strike: parseFloat(newStrike),
  //       option_type: newOptionType,
  //       maturity: parseFloat(newMaturity),
  //     };
  //   }

  //   const id = crypto.randomUUID();

  //   dispatch({
  //     type: "ADD_POSITION",
  //     payload: { id, position },
  //   });

  //   // reset inputs
  //   setNewTicker("");
  //   setNewQuantity("");
  //   setNewStrike("");
  //   setNewMaturity("");
  //   setNewOptionType("call");
  // };


  return (
    <div>
      <h2>Portfolio Overview</h2>

      <div style={{ marginBottom: 16 }}>
        <button onClick={handleSavePortfolio}>Save Portfolio</button>

        <label
          style={{
            marginLeft: 20,
            cursor: "pointer",
            color: "blue",
            textDecoration: "underline",
          }}
        >
          Load Portfolio
          <input
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={handleLoadPortfolio}
          />
        </label>
      </div>

      <PortfolioPanel
        assets={assets}
        spotPrices={spotPrices}
        positions={positionsArray}
        onAddPosition={handleAddPosition}
        onDeletePosition={handleDeletePosition}
      />
      {/* {positionsArray.length === 0 ? (
        <p>No positions added yet.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Strike</th>
              <th>Option</th>
              <th>Maturity</th>
              <th>Spot</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {positionsArray.map(([id, pos]) => {
              const ticker =
                pos.product_type === "stock"
                  ? pos.ticker
                  : pos.underlying;

              const spot = spotPrices[ticker] || 0;

              return (
                <tr key={id}>
                  <td>{ticker}</td>
                  <td>{pos.product_type}</td>
                  <td>{pos.quantity}</td>
                  <td>{pos.strike || "—"}</td>
                  <td>{pos.option_type || "—"}</td>
                  <td>{pos.maturity || "—"}</td>
                  <td>{spot.toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleDelete(id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <hr />

      <h3>Add Position</h3>

      <label>
        <input
          type="radio"
          checked={addType === "stock"}
          onChange={() => setAddType("stock")}
        />
        Stock
      </label>

      <label style={{ marginLeft: 10 }}>
        <input
          type="radio"
          checked={addType === "option"}
          onChange={() => setAddType("option")}
        />
        Option
      </label>

      <div>
        <select
          value={newTicker}
          onChange={(e) => setNewTicker(e.target.value)}
        >
          <option value="">Select ticker</option>
          {assets.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div>
        <input
          type="number"
          placeholder="Quantity"
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
        />
      </div>

      {addType === "option" && (
        <>
          <input
            type="number"
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
            type="number"
            placeholder="Maturity"
            value={newMaturity}
            onChange={(e) => setNewMaturity(e.target.value)}
          />
        </>
      )}

      <br />
      <button onClick={handleAddPosition}>
        Add Position
      </button> */}
    </div> 
  );
}

export default PortfolioPage;
