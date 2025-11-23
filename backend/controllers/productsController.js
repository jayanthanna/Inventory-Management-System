const { validationResult } = require("express-validator");
const fs = require("fs");
const csv = require("csv-parser");
const db = require("../db");
const { productsToCsv } = require("../utils/csvHelpers");

// GET /api/products
exports.getAllProducts = (req, res, next) => {
  let {
    page = 1,
    limit = 10,
    sort = "name",
    order = "asc",
    search = "",
    category = "",
  } = req.query;

  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  const allowedSort = {
    name: "name",
    category: "category",
    brand: "brand",
    stock: "stock",
    status: "status",
    created_at: "created_at",
  };

  const sortColumn = allowedSort[sort] || "id";
  const sortDir = order && order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const offset = (page - 1) * limit;

  const whereClauses = [];
  const params = [];

  if (search) {
    whereClauses.push("LOWER(name) LIKE ?");
    params.push(`%${search.toLowerCase()}%`);
  }

  if (category) {
    whereClauses.push("category = ?");
    params.push(category);
  }

  const whereSQL = whereClauses.length
    ? `WHERE ${whereClauses.join(" AND ")}`
    : "";

  db.get(
    `SELECT COUNT(*) as total FROM products ${whereSQL}`,
    params,
    (err, countRow) => {
      if (err) return next(err);

      const total = countRow.total;

      db.all(
        `SELECT * FROM products ${whereSQL}
         ORDER BY ${sortColumn} ${sortDir}
         LIMIT ? OFFSET ?`,
        [...params, limit, offset],
        (err2, rows) => {
          if (err2) return next(err2);

          res.json({
            data: rows,
            total,
            page,
            limit,
          });
        }
      );
    }
  );
};

// GET /api/products/search?name=xyz
exports.searchProducts = (req, res, next) => {
  const { name = "" } = req.query;
  const query = `%${name.toLowerCase()}%`;
  db.all(
    "SELECT * FROM products WHERE LOWER(name) LIKE ?",
    [query],
    (err, rows) => {
      if (err) return next(err);
      res.json(rows);
    }
  );
};

// POST /api/products (for Add New Product)
exports.createProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // status is not taken from body anymore
  const { name, unit, category, brand, stock, image } = req.body;
  const stockInt = parseInt(stock || "0", 10);
  const computedStatus = stockInt > 0 ? "In Stock" : "Out of Stock";
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO products 
     (name, unit, category, brand, stock, status, image, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      unit || "",
      category || "",
      brand || "",
      isNaN(stockInt) ? 0 : stockInt,
      computedStatus,
      image || "",
      now,
      now,
    ],
    function (err) {
      if (err) return next(err);

      db.get(
        "SELECT * FROM products WHERE id = ?",
        [this.lastID],
        (err2, row) => {
          if (err2) return next(err2);
          res.status(201).json(row);
        }
      );
    }
  );
};

// PUT /api/products/:id
exports.updateProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  // status is not trusted from client; we recompute
  const { name, unit, category, brand, stock, image } = req.body;
  const stockInt = parseInt(stock, 10);

  db.get("SELECT * FROM products WHERE id = ?", [id], (err, existing) => {
    if (err) return next(err);
    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check name uniqueness (excluding this product)
    db.get(
      "SELECT id FROM products WHERE LOWER(name) = ? AND id != ?",
      [name.toLowerCase(), id],
      (err2, conflict) => {
        if (err2) return next(err2);
        if (conflict) {
          return res.status(400).json({ message: "Name already in use" });
        }

        const now = new Date().toISOString();
        const computedStatus = stockInt > 0 ? "In Stock" : "Out of Stock";

        db.run(
          `UPDATE products
           SET name = ?, unit = ?, category = ?, brand = ?, stock = ?, status = ?, image = ?, updated_at = ?
           WHERE id = ?`,
          [
            name,
            unit,
            category,
            brand,
            stockInt,
            computedStatus,
            image || existing.image,
            now,
            id,
          ],
          function (err3) {
            if (err3) return next(err3);

            // If stock changed, log it
            if (existing.stock !== stockInt) {
              db.run(
                `INSERT INTO inventory_logs (product_id, old_stock, new_stock, changed_by, created_at)
                 VALUES (?, ?, ?, ?, ?)`,
                [id, existing.stock, stockInt, "admin", now]
              );
            }

            db.get(
              "SELECT * FROM products WHERE id = ?",
              [id],
              (err4, updated) => {
                if (err4) return next(err4);
                res.json(updated);
              }
            );
          }
        );
      }
    );
  });
};

// DELETE /api/products/:id
exports.deleteProduct = (req, res, next) => {
  const id = req.params.id;
  db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
    if (err) return next(err);
    if (this.changes === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  });
};

// POST /api/products/import
exports.importProducts = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "CSV file is required" });
  }

  const filePath = req.file.path;
  const rows = [];
  let addedCount = 0;
  let skipped = 0;
  const duplicates = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => rows.push(row))
    .on("end", () => {
      if (rows.length === 0) {
        fs.unlinkSync(filePath);
        return res.json({ added: 0, skipped: 0, duplicates: [] });
      }

      let processed = 0;
      const now = new Date().toISOString();

      rows.forEach((row) => {
        const name = row.name?.trim();
        if (!name) {
          skipped++;
          processed++;
          if (processed === rows.length) finish();
          return;
        }

        const unit = row.unit || "";
        const category = row.category || "";
        const brand = row.brand || "";
        const stockInt = parseInt(row.stock || "0", 10);
        const status =
          row.status || (stockInt > 0 ? "In Stock" : "Out of Stock");
        const image = row.image || "";

        db.get(
          "SELECT id FROM products WHERE LOWER(name) = ?",
          [name.toLowerCase()],
          (err, existing) => {
            if (err) {
              fs.unlinkSync(filePath);
              return next(err);
            }

            if (existing) {
              duplicates.push({ name, existingId: existing.id });
              skipped++;
              processed++;
              if (processed === rows.length) finish();
            } else {
              db.run(
                `INSERT INTO products 
                 (name, unit, category, brand, stock, status, image, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  name,
                  unit,
                  category,
                  brand,
                  isNaN(stockInt) ? 0 : stockInt,
                  status,
                  image,
                  now,
                  now,
                ],
                (err2) => {
                  if (err2) {
                    skipped++;
                  } else {
                    addedCount++;
                  }
                  processed++;
                  if (processed === rows.length) finish();
                }
              );
            }
          }
        );
      });

      function finish() {
        fs.unlinkSync(filePath);
        res.json({ added: addedCount, skipped, duplicates });
      }
    });
};

// GET /api/products/export
exports.exportProducts = (req, res, next) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return next(err);

    const csvData = productsToCsv(rows);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="products.csv"');
    res.status(200).send(csvData);
  });
};

// GET /api/products/:id/history
exports.getProductHistory = (req, res, next) => {
  const id = req.params.id;
  db.all(
    "SELECT * FROM inventory_logs WHERE product_id = ? ORDER BY created_at DESC",
    [id],
    (err, rows) => {
      if (err) return next(err);
      res.json(rows);
    }
  );
};
