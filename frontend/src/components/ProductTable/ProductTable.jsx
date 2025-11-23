import React from "react";
import ProductRow from "./ProductRow";
import "./ProductTable.css";

const ProductTable = ({
  products,
  sortField,
  sortOrder,
  onSortChange,
  onSaveRow,
  onDeleteRow,
  onRowClick,
}) => {
  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <span className="sort-icon idle">⇅</span>;
    }

    return sortOrder === "asc" ? (
      <span className="sort-icon">⬆️</span>
    ) : (
      <span className="sort-icon">⬇️</span>
    );
  };

  return (
    <div className="table-wrapper">
      <table className="products-table">
        <thead>
          <tr>
            <th>Image</th>

            <th
              className="sortable"
              onClick={() => onSortChange("name")}
              style={{ cursor: "pointer" }}
            >
              Name {renderSortIcon("name")}
            </th>

            <th>Unit</th>

            <th
              className="sortable"
              onClick={() => onSortChange("category")}
              style={{ cursor: "pointer" }}
            >
              Category {renderSortIcon("category")}
            </th>

            <th
              className="sortable"
              onClick={() => onSortChange("brand")}
              style={{ cursor: "pointer" }}
            >
              Brand {renderSortIcon("brand")}
            </th>

            <th
              className="sortable"
              onClick={() => onSortChange("stock")}
              style={{ cursor: "pointer" }}
            >
              Stock {renderSortIcon("stock")}
            </th>

            <th
              className="sortable"
              onClick={() => onSortChange("status")}
              style={{ cursor: "pointer" }}
            >
              Status {renderSortIcon("status")}
            </th>

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: 16 }}>
                No products found.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                onSave={onSaveRow}
                onDelete={onDeleteRow}
                onRowClick={onRowClick}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
