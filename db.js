// ============================================================
// Tanguí Pedidos — capa de base de datos
// Dos backends: Postgres (si existe DATABASE_URL) o SQLite
// local (node:sqlite, sin dependencias nativas) como respaldo.
// Toda la app usa esta API async; server.js no toca SQL directo.
// ============================================================

const path = require("path");
const { SEED_CATALOG, CATALOG_VERSION } = require("./seed");

let kind = null;   // "pg" | "sqlite"
let pool = null;   // pg Pool
let sdb = null;    // node:sqlite DatabaseSync

const SQLITE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS kv (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    items TEXT NOT NULL,
    customer TEXT NOT NULL,
    payment TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'nuevo',
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
`;

const PG_SCHEMA = `
  CREATE TABLE IF NOT EXISTS kv (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    items TEXT NOT NULL,
    customer TEXT NOT NULL,
    payment TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'nuevo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`;

async function init() {
  if (process.env.DATABASE_URL) {
    const { Pool } = require("pg");
    const url = process.env.DATABASE_URL;
    // Render/Supabase/etc. exigen SSL; local no.
    const local = /localhost|127\.0\.0\.1/.test(url);
    pool = new Pool({
      connectionString: url,
      ssl: local ? false : { rejectUnauthorized: false }
    });
    await pool.query(PG_SCHEMA);
    kind = "pg";
    console.log("[kapohs] DB: Postgres");
  } else {
    const { DatabaseSync } = require("node:sqlite");
    sdb = new DatabaseSync(path.join(__dirname, "kapohs-kitchen.db"));
    sdb.exec(SQLITE_SCHEMA);
    kind = "sqlite";
    console.log("[kapohs] DB: SQLite local (kapohs-kitchen.db)");
  }

  // Semilla solo si no existe; re-sembrar si sube CATALOG_VERSION
  if (!(await kvGet("catalog"))) {
    await kvSet("catalog", JSON.stringify(SEED_CATALOG));
    await kvSet("catalog_version", String(CATALOG_VERSION));
    console.log("[kapohs] Catálogo semilla cargado.");
  } else {
    const v = await kvGet("catalog_version");
    if (v !== String(CATALOG_VERSION)) {
      await kvSet("catalog", JSON.stringify(SEED_CATALOG));
      await kvSet("catalog_version", String(CATALOG_VERSION));
      console.log(`[kapohs] Catálogo re-sembrado (v${v} → v${CATALOG_VERSION}).`);
    }
  }
  if (!(await kvGet("order_seq"))) await kvSet("order_seq", "0");
  return kind;
}

function dbKind() { return kind; }

// ---------- kv ----------
async function kvGet(key) {
  if (kind === "pg") {
    const r = await pool.query("SELECT value FROM kv WHERE key = $1", [key]);
    return r.rows.length ? r.rows[0].value : null;
  }
  const row = sdb.prepare("SELECT value FROM kv WHERE key = ?").get(key);
  return row ? row.value : null;
}

async function kvSet(key, value) {
  if (kind === "pg") {
    await pool.query(
      "INSERT INTO kv (key, value) VALUES ($1, $2) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      [key, value]
    );
    return;
  }
  sdb.prepare(
    "INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  ).run(key, value);
}

// ---------- catálogo ----------
async function getCatalog() {
  return JSON.parse(await kvGet("catalog"));
}
async function setCatalog(cat) {
  await kvSet("catalog", JSON.stringify(cat));
}

// ---------- pedidos ----------
function mapOrder(row) {
  return {
    id: row.id,
    number: row.number,
    type: row.type,
    items: JSON.parse(row.items),
    customer: JSON.parse(row.customer),
    payment: row.payment,
    notes: row.notes || "",
    status: row.status,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at
  };
}

// Número de pedido secuencial, atómico en ambos backends.
async function nextOrderNumber() {
  let seq;
  if (kind === "pg") {
    const r = await pool.query(
      `INSERT INTO kv (key, value) VALUES ('order_seq', '1')
       ON CONFLICT(key) DO UPDATE SET value = ((kv.value)::int + 1)::text
       RETURNING value`
    );
    seq = Number(r.rows[0].value);
  } else {
    seq = Number(await kvGet("order_seq")) + 1;
    await kvSet("order_seq", String(seq));
  }
  return "#" + String(seq).padStart(3, "0");
}

async function createOrder({ number, type, items, customer, payment, notes, status }) {
  const st = status || "nuevo";
  if (kind === "pg") {
    const r = await pool.query(
      `INSERT INTO orders (number, type, items, customer, payment, notes, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [number, type, JSON.stringify(items), JSON.stringify(customer), payment, notes || null, st]
    );
    return mapOrder(r.rows[0]);
  }
  const info = sdb.prepare(
    "INSERT INTO orders (number, type, items, customer, payment, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(number, type, JSON.stringify(items), JSON.stringify(customer), payment, notes || null, st);
  const row = sdb.prepare("SELECT * FROM orders WHERE id = ?").get(info.lastInsertRowid);
  return mapOrder(row);
}

async function listOrders() {
  if (kind === "pg") {
    const r = await pool.query("SELECT * FROM orders ORDER BY id DESC LIMIT 200");
    return r.rows.map(mapOrder);
  }
  return sdb.prepare("SELECT * FROM orders ORDER BY id DESC LIMIT 200").all().map(mapOrder);
}

async function getOrder(id) {
  if (kind === "pg") {
    const r = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    return r.rows.length ? mapOrder(r.rows[0]) : null;
  }
  const row = sdb.prepare("SELECT * FROM orders WHERE id = ?").get(id);
  return row ? mapOrder(row) : null;
}

async function updateOrderStatus(id, status) {
  if (kind === "pg") {
    const r = await pool.query("UPDATE orders SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
    return r.rows.length ? mapOrder(r.rows[0]) : null;
  }
  const row = sdb.prepare("SELECT * FROM orders WHERE id = ?").get(id);
  if (!row) return null;
  sdb.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
  return mapOrder(sdb.prepare("SELECT * FROM orders WHERE id = ?").get(id));
}

// Solo para limpieza de pruebas (no se expone en la API).
async function deleteOrder(id) {
  if (kind === "pg") {
    await pool.query("DELETE FROM orders WHERE id = $1", [id]);
  } else {
    sdb.prepare("DELETE FROM orders WHERE id = ?").run(id);
  }
}

module.exports = {
  init,
  dbKind,
  kvGet,
  kvSet,
  getCatalog,
  setCatalog,
  nextOrderNumber,
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder
};
