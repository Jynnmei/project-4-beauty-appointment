import { pool } from "../db/db.js";

// GET
export const getVendor = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT users.user_id, users.username 
       FROM users
       JOIN roles ON users.role_id = roles.id
       WHERE roles.name = 'VENDOR'`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Server error" });
  }
};

// GET
export const getTypes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM types");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Server error" });
  }
};

// GET
export const getServices = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM service_catalog ORDER BY catalog_id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to get services" });
  }
};
