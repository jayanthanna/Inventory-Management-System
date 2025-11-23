require("dotenv").config();
const express = require("express");
const cors = require("cors");
const productsRoutes = require("./routes/products");
const errorHandler = require("./middlewares/errorHandler");
require("./db"); // initializing db tables
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple root route
app.get("/", (req, res) => {
  res.send("Inventory API is running");
});

app.use("/api/auth", authRoutes);
// API routes
app.use("/api/products", productsRoutes);

// Error handler (after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
