import { pool } from "../db/db.js";

// get appointment_vendors
export const getAppointmentVendors = async (req, res) => {
  const vendor_id = req.decoded.user_id;
  console.log("vendor_id:", vendor_id);
  try {
    const result = await pool.query(
      `SELECT 
          a.appointment_id, 
          a.appointment_datetime, 
          st.name AS status, 
          u.username AS client,
          u.phone AS client_phone,
          u.address AS client_address,
          json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) AS types,
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
      LEFT JOIN users u ON a.client_id = u.user_id
      WHERE av.vendor_id = $1
      GROUP BY 
          a.appointment_id, 
          a.appointment_datetime, 
          st.name,
          u.username,
          u.phone,
          u.address
      ORDER BY a.appointment_datetime DESC;`,
      [vendor_id]
    );
    res.json({ status: "ok", vendors: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ status: "error", msg: "Failed to fetch vendors" });
  }
};

// get appointment_vendors_by_id
export const getAppointmentVendorsById = async (req, res) => {
  const { appointment_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT vendor_id FROM appointment_vendor WHERE appointment_id = $1`,
      [appointment_id]
    );
    res.json({ status: "ok", vendors: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ status: "error", msg: "Failed to fetch vendors" });
  }
};

// add Vendor to Appointment
export const addAppointmentVendor = async (req, res) => {
  const { appointment_id, vendor_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO appointment_vendor (appointment_id, vendor_id)
       VALUES ($1, $2)
       ON CONFLICT (appointment_id, vendor_id) DO NOTHING
       RETURNING *`,
      [appointment_id, vendor_id]
    );
    res.json({ status: "ok", data: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ status: "error", msg: "Failed to add vendor" });
  }
};

// PATCH
export const updateAppointmentVendor = async (req, res) => {
  const { appointment_id } = req.params;
  const { vendor_id } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateResult = await client.query(
      `UPDATE appointment_vendor
       SET vendor_id = $2
       WHERE appointment_id = $1
       RETURNING *`,
      [appointment_id, vendor_id]
    );

    let resultRow;

    if (updateResult.rowCount === 0) {
      const insertResult = await client.query(
        `INSERT INTO appointment_vendor (appointment_id, vendor_id)
         VALUES ($1, $2)
         RETURNING *`,
        [appointment_id, vendor_id]
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
    res.status(400).json({ status: "error", msg: "Failed to update vendor" });
  } finally {
    client.release();
  }
};

// delete Vendor
export const deleteAppointmentVendor = async (req, res) => {
  const { appointment_id, vendor_id } = req.params;

  try {
    await pool.query(
      `DELETE FROM appointment_vendor
       WHERE appointment_id = $1 AND vendor_id = $2`,
      [appointment_id, vendor_id]
    );
    res.json({ status: "ok", msg: "Vendor removed" });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ status: "error", msg: "Failed to delete vendor" });
  }
};

// ============================================================

// get all appointment_services
export const getAppointmentServices = async (req, res) => {
  const { appointment_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT service_id FROM appointment_service WHERE appointment_id = $1`,
      [appointment_id]
    );
    res.json({ status: "ok", services: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ status: "error", msg: "Failed to fetch services" });
  }
};

// add Service to Appointment
export const addAppointmentService = async (req, res) => {
  const { appointment_id, service_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO appointment_service (appointment_id, service_id)
       VALUES ($1, $2)
       ON CONFLICT (appointment_id, service_id) DO NOTHING
       RETURNING *`,
      [appointment_id, service_id]
    );
    res.json({ status: "ok", data: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ status: "error", msg: "Failed to add service" });
  }
};

// PATCH
export const updateAppointmentService = async (req, res) => {
  const { appointment_id } = req.params;
  const { service_id } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateResult = await client.query(
      `UPDATE appointment_service
       SET service_id = $2
       WHERE appointment_id = $1
       RETURNING *`,
      [appointment_id, service_id]
    );

    let resultRow;

    if (updateResult.rowCount === 0) {
      const insertResult = await client.query(
        `INSERT INTO appointment_service (appointment_id, service_id)
         VALUES ($1, $2)
         RETURNING *`,
        [appointment_id, service_id]
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
    res.status(400).json({ status: "error", msg: "Failed to update service" });
  } finally {
    client.release();
  }
};

// delete Service
export const deleteAppointmentService = async (req, res) => {
  const { appointment_id, service_id } = req.params;

  try {
    await pool.query(
      `DELETE FROM appointment_service
       WHERE appointment_id = $1 AND service_id = $2`,
      [appointment_id, service_id]
    );
    res.json({ status: "ok", msg: "Service removed" });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ status: "error", msg: "Failed to delete service" });
  }
};
