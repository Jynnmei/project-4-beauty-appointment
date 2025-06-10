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
         a.appointment_id, 
         a.appointment_datetime, 
         st.name AS status, 
         t.name AS type_name,
         json_agg(DISTINCT v.username) AS vendors,
         json_agg(DISTINCT c.title) AS services
       FROM appointment a
       LEFT JOIN status st ON a.status_id = st.id
       LEFT JOIN types t ON a.type_id = t.id
       LEFT JOIN appointment_vendor av ON a.appointment_id = av.appointment_id
       LEFT JOIN users v ON av.vendor_id = v.user_id
       LEFT JOIN appointment_service aps ON a.appointment_id = aps.appointment_id
       LEFT JOIN service s ON aps.service_id = s.catalog_id
       LEFT JOIN service_catalog c ON s.catalog_id = c.catalog_id 
       WHERE a.client_id = $1
       GROUP BY a.appointment_id, a.appointment_datetime, st.name, t.name
       ORDER BY a.appointment_datetime DESC`,
      [client_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Failed to get appointments" });
  }
};
