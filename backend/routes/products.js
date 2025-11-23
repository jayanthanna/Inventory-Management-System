const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const productsController = require("../controllers/productsController");
const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/authMiddleware");

// Validation rules reused for create/update
const productValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("unit").notEmpty().withMessage("Unit is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("brand").notEmpty().withMessage("Brand is required"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a number >= 0"),
  // body("status").notEmpty().withMessage("Status is required"),
];

// All product routes require authentication
router.use(authMiddleware);

// GET /api/products
router.get("/", productsController.getAllProducts);

// GET /api/products/search?name=xyz
router.get("/search", productsController.searchProducts);

// POST /api/products
router.post("/", productValidation, productsController.createProduct);

// PUT /api/products/:id
router.put("/:id", productValidation, productsController.updateProduct);

// DELETE /api/products/:id
router.delete("/:id", productsController.deleteProduct);

// POST /api/products/import
router.post(
  "/import",
  upload.single("file"),
  productsController.importProducts
);

// GET /api/products/export
router.get("/export", productsController.exportProducts);

// GET /api/products/:id/history
router.get("/:id/history", productsController.getProductHistory);

module.exports = router;
