import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Since we run this from host, we use localhost:15432
const connectionString = "postgresql://root:root@localhost:15432/invoices_db";

const client = new pg.Client({
  connectionString,
});

async function run() {
  try {
    await client.connect();
    // Path to sql file relative to this script: ../../database/sql/004_payment.sql
    const sqlPath = path.join(__dirname, '../../database/sql/004_payment.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log(`Running migration: ${sql}`);
    await client.query(sql);
    console.log("Migration successful");
  } catch (err) {
    console.error("Migration failed", err);
  } finally {
    await client.end();
  }
}

run();
