import { pool } from "../src/db/pool.js";
import fs from "fs";
import path from "path";

async function applyDelta() {
  const sqlPath = path.resolve("..", "..", "Individual04_Add a new line-item UI Form_Add Reports", "invoice_lab4_delta.sql");
  try {
    const sql = fs.readFileSync(sqlPath, "utf-8");
    console.log("Applying delta script...");
    await pool.query(sql);
    console.log("Delta script applied successfully.");
  } catch (err) {
    console.error("Error applying delta script:", err);
  } finally {
    process.exit(0);
  }
}

applyDelta();
