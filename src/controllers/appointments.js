import { pool } from "../db/db.js";

export const getAllServices = async (req, res) => {
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

export const createAppointment = async (req, res) => {
  const {
    client_id,
    vendor_id,
    service_id,
    appointment_date,
    appointment_time,
  } = req.body;

  try {
    const query = `
      INSERT INTO appointment (client_id, vendor_id, service_id, appointment_date, appointment_time)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const values = [
      client_id,
      vendor_id,
      service_id,
      appointment_date,
      appointment_time,
    ];
    const result = await pool.query(query, values);

    res.json({ status: "ok", msg: "appointment created" });
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Failed to create appointment" });
  }
};
