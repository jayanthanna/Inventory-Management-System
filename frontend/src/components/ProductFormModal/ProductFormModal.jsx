import React, { useState, useEffect } from "react";
import "./ProductFormModal.css";

const emptyForm = {
  name: "",
  unit: "",
  category: "",
  brand: "",
  stock: 0,
  status: "In Stock",
  image: "",
};

const ProductFormModal = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!form.name || !form.unit || !form.category || !form.brand) {
      alert("Please fill required fields (name, unit, category, brand)");
      return;
    }
    // Convert stock to number
    const stockInt = Number(form.stock || 0);
    onSubmit({ ...form, stock: stockInt });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-body" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Product</h3>
          <button onClick={onClose}>X</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <label>Name*</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>Unit*</label>
            <input
              value={form.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>Category*</label>
            <input
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>Brand*</label>
            <input
              value={form.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>Stock*</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>Status*</label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="form-row">
            <label>Image URL</label>
            <input
              value={form.image}
              onChange={(e) => handleChange("image", e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
