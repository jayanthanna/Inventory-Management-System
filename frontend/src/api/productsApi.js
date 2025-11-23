import axiosClient from "./axiosClient";

// export const getProducts = () => axiosClient.get("/api/products");
export const getProducts = (params) =>
  axiosClient.get("/api/products", { params });

export const searchProducts = (name) =>
  axiosClient.get("/api/products/search", { params: { name } });

export const createProduct = (data) => axiosClient.post("/api/products", data);

export const updateProduct = (id, data) =>
  axiosClient.put(`/api/products/${id}`, data);

export const deleteProduct = (id) => axiosClient.delete(`/api/products/${id}`);

export const importProducts = (formData) =>
  axiosClient.post("/api/products/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const exportProducts = () =>
  axiosClient.get("/api/products/export", { responseType: "blob" });

export const getProductHistory = (id) =>
  axiosClient.get(`/api/products/${id}/history`);
