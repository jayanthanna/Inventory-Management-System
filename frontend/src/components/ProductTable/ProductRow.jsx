import React, { useState, useEffect } from "react";

const ProductRow = ({ product, onSave, onDelete, onRowClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(product);

  useEffect(() => {
    setDraft(product);
  }, [product]);

  const handleChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(product.id, draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(product);
    setIsEditing(false);
  };

  // Status derived purely from stock
  const currentStatus = draft.stock === 0 ? "Out of Stock" : "In Stock";
  const statusClass =
    currentStatus === "Out of Stock" ? "stock-badge out" : "stock-badge in";

  return (
    <>
      <tr
        className="product-row main-row"
        onClick={(e) => {
          // avoid triggering when clicking inside a button
          if (!e.target.closest || !e.target.closest("button")) {
            if (!isEditing) onRowClick(product);
          }
        }}
      >
        <td className="cell-image">
          {product.image ? (
            <img src={product.image} alt={product.name} className="thumb" />
          ) : (
            <div className="thumb placeholder" />
          )}
        </td>

        <td className="cell-name">
          {isEditing ? (
            <input
              className="input-inline"
              value={draft.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          ) : (
            <div className="name-text">{product.name}</div>
          )}
        </td>

        <td>
          {isEditing ? (
            <input
              className="input-inline"
              value={draft.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
            />
          ) : (
            product.unit
          )}
        </td>

        <td>
          {isEditing ? (
            <input
              className="input-inline"
              value={draft.category}
              onChange={(e) => handleChange("category", e.target.value)}
            />
          ) : (
            product.category
          )}
        </td>

        <td>
          {isEditing ? (
            <input
              className="input-inline"
              value={draft.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
            />
          ) : (
            product.brand
          )}
        </td>

        <td>
          {isEditing ? (
            <input
              className="input-inline"
              type="number"
              value={draft.stock}
              onChange={(e) =>
                handleChange("stock", Number(e.target.value || 0))
              }
            />
          ) : (
            product.stock
          )}
        </td>

        <td>
          <span className={statusClass}>{currentStatus}</span>
        </td>

        <td className="cell-actions">
          {isEditing ? (
            <>
              <button className="btn btn-save" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-edit"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="btn btn-delete"
                onClick={() => onDelete(product.id)}
                title="Delete product"
              >
                Delete
              </button>
            </>
          )}
        </td>
      </tr>

      <tr className="details-row" aria-hidden="true">
        <td colSpan="8" className="details-cell">
          <div className="details-content">
            <div className="details-left">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="thumb-large"
                />
              ) : (
                <div className="thumb-large placeholder" />
              )}
            </div>
            <div className="details-right">
              <div className="details-line">
                <strong>Category:</strong> {product.category || "—"}
              </div>
              <div className="details-line">
                <strong>Brand:</strong> {product.brand || "—"}
              </div>
              <div className="details-line">
                <strong>Unit:</strong> {product.unit || "—"}
              </div>
              <div className="details-line">
                <strong>Stock:</strong> {product.stock}
              </div>
              <div className="details-line muted">
                <strong>ID:</strong> {product.id}
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

export default ProductRow;
