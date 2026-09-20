import pg from "pg";

let pool = null;

export function getPool() {
  if (pool) return pool;
  pool = new pg.Pool({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/chaicodellm",
  });
  return pool;
}

export function query(text, params) {
  return getPool().query(text, params);
}

export async function closePool() {
  if (pool) await pool.end();
  pool = null;
}
