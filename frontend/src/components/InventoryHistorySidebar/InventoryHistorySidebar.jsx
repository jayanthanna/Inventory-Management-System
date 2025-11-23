import React from "react";
import "./InventoryHistorySidebar.css";

const InventoryHistorySidebar = ({ product, history, onClose }) => {
  if (!product) return null;

  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <div className="sidebar-panel" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <h3>Inventory History</h3>
          <button onClick={onClose} style={{ cursor: "pointer" }}>
            X
          </button>
        </div>

        <p className="sidebar-product-name">{product.name}</p>

        {history.length === 0 ? (
          <p>No history yet.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Old Stock</th>
                <th>New Stock</th>
                <th>Changed By</th>
              </tr>
            </thead>
            <tbody>
              {history.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                  <td>{log.old_stock}</td>
                  <td>{log.new_stock}</td>
                  <td>{log.changed_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InventoryHistorySidebar;
