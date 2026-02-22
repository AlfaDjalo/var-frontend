import React, { useState } from "react";
import PortfolioPanel from "../components/PortfolioPanel";

export default function PortfolioPage({ assets, spotPrices }) {
  const [localPositions, setLocalPositions] = useState({});
  const [editingId, setEditingId] = useState(null);

  const positionsArray = Object.entries(localPositions).map(
    ([id, position]) => ({ id, ...position })
  );

  const handleAddPosition = (position) => {
    const id = crypto.randomUUID();

    setLocalPositions(prev => ({
      ...prev,
      [id]: position
    }));
  };

  const handleDeletePosition = (id) => {
    setLocalPositions(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    if (editingId === id) {
      setEditingId(null);
    }
  };

  const handleEditPosition = (id) => {
    setEditingId(id);
  };

  const handleUpdatePosition = (id, updatedPosition) => {
    setLocalPositions(prev => ({
      ...prev,
      [id]: updatedPosition
    }));

    setEditingId(null);
  };

  return (
    <PortfolioPanel
      assets={assets}
      spotPrices={spotPrices}
      positions={positionsArray}
      editingId={editingId}
      onAddPosition={handleAddPosition}
      onDeletePosition={handleDeletePosition}
      onEditPosition={handleEditPosition}
      onUpdatePosition={handleUpdatePosition}
      onCancelEdit={() => setEditingId(null)}
    />
  );
}
