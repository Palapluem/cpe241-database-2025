import { pool } from "../db/pool.js";

export const getConfiguration = async (req, res) => {
  try {
    // Fetch the first configuration record (assuming ID 1 holds the current settings)
    const result = await pool.query(
      "SELECT vat_percent FROM configuration ORDER BY id LIMIT 1"
    );

    if (result.rows.length === 0) {
      // Fallback if no configuration exists
      return res.json({ vat_percent: "7.00" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error retrieving configuration:", error);
    res.status(500).json({ error: error.message });
  }
};