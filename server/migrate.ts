import { pool } from "./db";

export default async function runMigrations() {
  try {
    // Add hashed_password column if it doesn't exist
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS hashed_password TEXT NOT NULL DEFAULT '';
    `);
    console.log("Migration: hashed_password column ensured.");
  } catch (err: any) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}
