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
          a.status_id,
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
    const grouped = {
      PENDING: [],
      CONFIRMED: [],
      COMPLETED: [],
      CANCELLED: [],
    };

    result.rows.forEach((row) => {
      switch (row.status_id) {
        case 1:
          grouped.PENDING.push(row);
          break;
        case 2:
          grouped.CONFIRMED.push(row);
          break;
        case 3:
          grouped.COMPLETED.push(row);
          break;
        case 5:
          grouped.CANCELLED.push(row);
          break;
        default:
          break;
      }
    });

    res.json({ status: "ok", data: grouped });
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
