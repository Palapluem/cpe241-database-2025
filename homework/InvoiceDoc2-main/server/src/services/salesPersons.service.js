import { pool } from "../db/pool.js";

export async function listSalesPersons({ search = "", page = 1, limit = 10 } = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `SELECT COUNT(*) as total
     FROM sales_person
     WHERE code ILIKE $1 OR name ILIKE $1`,
    [searchParam],
  );

  const { rows } = await pool.query(
    `SELECT id, code, name, start_work_date
     FROM sales_person
     WHERE code ILIKE $1 OR name ILIKE $1
     ORDER BY code ASC
     LIMIT $2 OFFSET $3`,
    [searchParam, Number(limit), offset],
  );

  const total = Number(countResult.rows[0].total);
  return {
    data: rows,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  };
}

export async function getSalesPersonById(id) {
  const { rows } = await pool.query(
    `SELECT id, code, name, start_work_date
     FROM sales_person
     WHERE id = $1`,
    [id]
  );
  if (!rows.length) throw new Error("Sales person not found");
  return rows[0];
}

export async function createSalesPerson({ code, name, start_work_date }) {
  const { rows } = await pool.query(
    `INSERT INTO sales_person (code, name, start_work_date)
     VALUES ($1, $2, $3)
     RETURNING id, code, name, start_work_date`,
    [code, name, start_work_date]
  );
  return rows[0];
}

export async function updateSalesPerson({ id, code, name, start_work_date }) {
  const { rows } = await pool.query(
    `UPDATE sales_person
     SET code = $1, name = $2, start_work_date = $3
     WHERE id = $4
     RETURNING id, code, name, start_work_date`,
    [code, name, start_work_date, id]
  );
  if (!rows.length) throw new Error("Sales person not found");
  return rows[0];
}
