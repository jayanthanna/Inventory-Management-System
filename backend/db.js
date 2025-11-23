const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = process.env.DB_PATH || path.join(__dirname, "inventory.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    unit TEXT,
    category TEXT,
    brand TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    status TEXT,
    image TEXT,
    created_at TEXT,
    updated_at TEXT
  )
`);

  db.run(`
  CREATE TABLE IF NOT EXISTS inventory_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    old_stock INTEGER,
    new_stock INTEGER,
    changed_by TEXT,
    created_at TEXT,
    FOREIGN KEY(product_id) REFERENCES products(id)
  )
`);

  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT
    )
  `);
});

module.exports = db;
