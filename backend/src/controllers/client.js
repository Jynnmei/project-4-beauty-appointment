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

// GET
export const getAppoinment = async (req, res) => {
  const client_id = req.decoded.user_id;
  console.log("client_id:", client_id);
  try {
    const result = await pool.query(
      `SELECT 
         a.appointment_id, a.appointment_datetime, st.name AS status, 
         t.name AS type_name,
         v.username AS vendor_name,
         c.title AS service_title
       FROM appointment a
       LEFT JOIN status st ON a.status_id = st.id
       LEFT JOIN types t ON a.type_id = t.id
       LEFT JOIN users v ON a.vendor_id = v.user_id 
       LEFT JOIN service s ON a.service_id = s.catalog_id
       LEFT JOIN service_catalog c ON s.catalog_id = c.catalog_id 
       WHERE a.client_id = $1
       ORDER BY a.appointment_datetime DESC`,
      [client_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("SQL Error:", error);
    // console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Failed to get appointments" });
  }
};
