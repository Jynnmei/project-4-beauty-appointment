import { pool } from "../db/db.js";

// GET
export const getVendorAppointments = async (req, res) => {
  const { vendor_id } = req.params;

  try {
    const vendorCheck = await pool.query(
      "SELECT * FROM users WHERE user_id = $1 AND role_id = 2",
      [vendor_id]
    );
    if (vendorCheck.rows.length === 0) {
      return res.status(404).json({ status: "error", msg: "Vendor not found" });
    }

    const result = await pool.query(
      `SELECT 
         a.appointment_id, 
         a.appointment_datetime,
         a.client_id,
         u.username AS client_name,
         sc.title AS service_title,
         sc.price,
         a.status_id
       FROM appointment a
       JOIN users u ON a.client_id = u.user_id
       JOIN service s ON a.service_id = s.service_id
       JOIN service_catalog sc ON s.catalog_id = sc.catalog_id
       WHERE a.vendor_id = $1
       ORDER BY a.appointment_datetime`,
      [vendor_id]
    );

    res.json({ status: "ok", data: result.rows });
  } catch (error) {
    console.error("Error in getVendorAppointments:", error);
    res
      .status(400)
      .json({ status: "error", msg: "Failed to get appointments" });
  }
};

//POST
export const addService = async (req, res) => {
  const { vendor_id, catalog_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO service (vendor_id, catalog_id) VALUES ($1, $2) RETURNING *`,
      [vendor_id, catalog_id]
    );

    res.json({ status: "ok", service: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ status: "error", msg: "Failed to add service" });
  }
};

//DELETE
export const deleteService = async (req, res) => {
  const { service_id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM service WHERE service_id = $1 RETURNING *`,
      [service_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "Service not found or already deleted" });
    }

    res.json({ status: "ok", msg: "Service deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ status: "error", msg: "Failed to delete service" });
  }
};
