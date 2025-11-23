import React, { useRef } from "react";
import "./HeaderBar.css";

const HeaderBar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onAddNew,
  onImport,
  onExport,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onImport(file);
    e.target.value = "";
  };

  return (
    <div className="header-bar">
      <div className="header-left">
        <input
          type="text"
          className="search-input"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button className="btn primary" onClick={onAddNew}>
          Add New Product
        </button>
      </div>

      <div className="header-right">
        <input
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <button
          className="btn"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          Import
        </button>
        <button className="btn" onClick={onExport}>
          Export
        </button>
      </div>
    </div>
  );
};

export default HeaderBar;
