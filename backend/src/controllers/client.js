import { pool } from "../db/db.js";

// GET - 显示vendor的名字
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

// GET - 显示facial types
export const getTypes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM types");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Server error" });
  }
};

// GET - 显示service_catalog
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

// GET - 显示顾客自己all appoinment
export const getAppoinment = async (req, res) => {
  const client_id = req.decoded.user_id;
  console.log("client_id:", client_id);
  try {
    const result = await pool.query(
      `SELECT 
        a.appointment_id, 
        a.appointment_datetime, 
        st.name AS status, 
        json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) AS types,
        json_agg(DISTINCT v.username) FILTER (WHERE v.username IS NOT NULL) AS vendors,
        json_agg(DISTINCT c.title) FILTER (WHERE c.title IS NOT NULL) AS services
    FROM appointment a
    LEFT JOIN status st ON a.status_id = st.id
    LEFT JOIN appointment_type at ON a.appointment_id = at.appointment_id
    LEFT JOIN types t ON at.type_id = t.id
    LEFT JOIN appointment_vendor av ON a.appointment_id = av.appointment_id
    LEFT JOIN users v ON av.vendor_id = v.user_id
    LEFT JOIN appointment_service aps ON a.appointment_id = aps.appointment_id
    LEFT JOIN service s ON aps.service_id = s.catalog_id
    LEFT JOIN service_catalog c ON s.catalog_id = c.catalog_id 
    WHERE a.client_id = $1
    GROUP BY a.appointment_id, a.appointment_datetime, st.name
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

// PATCH - update facial type
export const updateAppointmentType = async (req, res) => {
  const { appointment_id } = req.params;
  const { type_id } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateResult = await client.query(
      `UPDATE appointment_type
       SET type_id = $2
       WHERE appointment_id = $1
       RETURNING *`,
      [appointment_id, type_id]
    );

    let resultRow;

    if (updateResult.rowCount === 0) {
      const insertResult = await client.query(
        `INSERT INTO appointment_type (appointment_id, type_id)
         VALUES ($1, $2)
         RETURNING *`,
        [appointment_id, type_id]
      );
      resultRow = insertResult.rows[0];
    } else {
      resultRow = updateResult.rows[0];
    }

    await client.query("COMMIT");
    res.json({ status: "ok", data: resultRow });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(400).json({ status: "error", msg: "Failed to update type" });
  } finally {
    client.release();
  }
};
