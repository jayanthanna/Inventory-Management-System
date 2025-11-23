import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure this import is present
import {
  getProducts,
  updateProduct,
  deleteProduct,
  importProducts,
  exportProducts,
  getProductHistory,
  createProduct,
} from "../api/productsApi";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import ProductTable from "../components/ProductTable/ProductTable";
import InventoryHistorySidebar from "../components/InventoryHistorySidebar/InventoryHistorySidebar";
import ProductFormModal from "../components/ProductFormModal/ProductFormModal";
import { toast } from "react-toastify";

const ProductsPage = () => {
  const navigate = useNavigate(); // Initialize navigate here
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Sorting
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Sidebar / history
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [history, setHistory] = useState([]);

  // Add product modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Categories from currently loaded page (good enough for now)
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts({
        page,
        limit: pageSize,
        sort: sortField,
        order: sortOrder,
        search: searchTerm || "",
        category: selectedCategory || "",
      });
      setProducts(res.data.data);
      setTotal(res.data.total);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortField, sortOrder, searchTerm, selectedCategory]);

  // === Handlers ===

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1); // reset to first page on new search
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setPage(1);
  };

  const handleSortChange = (field) => {
    setPage(1);
    // compute next order deterministically and set both states explicitly
    const nextOrder =
      sortField === field ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortField(field);
    setSortOrder(nextOrder);
  };

  const handleSaveRow = async (id, updated) => {
    try {
      const payload = {
        name: updated.name,
        unit: updated.unit,
        category: updated.category,
        brand: updated.brand,
        stock: updated.stock,
        image: updated.image || "",
      };
      const res = await updateProduct(id, payload);
      setProducts((prev) => prev.map((p) => (p.id === id ? res.data : p)));
      toast.success("Product updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    }
  };

  const handleDeleteRow = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      toast.success("Product deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const handleImport = async (file) => {
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await importProducts(fd);
      toast.success(
        `Imported: ${res.data.added}, Skipped: ${res.data.skipped}`
      );
      setPage(1);
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Import failed");
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportProducts();
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "products.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Export failed");
    }
  };

  const handleRowClick = async (product) => {
    setSelectedProduct(product);
    try {
      const res = await getProductHistory(product.id);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load history");
    }
  };

  const handleAddNew = () => {
    setIsAddOpen(true);
  };

  const handleCreateProduct = async (data) => {
    try {
      await createProduct(data);
      toast.success("Product created");
      setIsAddOpen(false);
      setPage(1);
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create product");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(page * pageSize, total);

  return (
    <div className="app-container">
      <div className="page-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Product Inventory Management</h2>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>

        <HeaderBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={categories}
          onAddNew={handleAddNew}
          onImport={handleImport}
          onExport={handleExport}
        />

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            <ProductTable
              products={products}
              sortField={sortField}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onSaveRow={handleSaveRow}
              onDeleteRow={handleDeleteRow}
              onRowClick={handleRowClick}
            />

            <div className="pagination-bar">
              <div>
                {total > 0 ? (
                  <span>
                    Showing {from}–{to} of {total}
                  </span>
                ) : (
                  <span>No products</span>
                )}
              </div>

              <div className="pagination-controls">
                <label>
                  Rows per page:{" "}
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>
                </label>

                <button
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Prev
                </button>

                <span style={{ margin: "0 8px" }}>
                  {page} / {totalPages}
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <InventoryHistorySidebar
        product={selectedProduct}
        history={history}
        onClose={() => setSelectedProduct(null)}
      />

      <ProductFormModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreateProduct}
      />
    </div>
  );
};

const logoutButtonStyle = {
  backgroundColor: "#e63946",
  color: "#ffffff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  marginLeft: "auto",
  transition: "background-color 0.3s",
};

export default ProductsPage;
