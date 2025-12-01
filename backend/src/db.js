import dotenv from "dotenv";
import pkg from "pg";
dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: false });

export async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      birth_date DATE,
      country TEXT,
      city TEXT,
      class_name TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // 🔴 NOWA TABELA PROGRESU
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_task_progress (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      task_id TEXT NOT NULL,
      completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, task_id)
    );
  `);
}
