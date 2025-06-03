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

// PUT
export const createAppointment = async (req, res) => {
  const { client_id, type_id, vendor_id, service_id, date, time } = req.body;

  try {
    const query = `
      INSERT INTO appointment (client_id, type_id, vendor_id, service_id, date, time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const values = [client_id, type_id, vendor_id, service_id, date, time];
    const result = await pool.query(query, values);

    res.json({ status: "ok", msg: "Appointment created" });
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Failed to create appointment" });
  }
};

// PATCH
export const updateAppointment = async (req, res) => {
  const { appointment_id } = req.params;
  const { client_id, type_id, vendor_id, service_id, date, time } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE appointment
      SET
        client_id = COALESCE($1, client_id),
        type_id = COALESCE($2, type_id),
        vendor_id = COALESCE($3, vendor_id),
        service_id = COALESCE($4, service_id),
        date = COALESCE($5, date),
        time = COALESCE($6, time)
      WHERE appointment_id = $7
      RETURNING *;
      `,
      [client_id, type_id, vendor_id, service_id, date, time, appointment_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "Appointment not found" });
    }

    res.json({ status: "ok", msg: "Appointment updated" });
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Error updating appointment" });
  }
};

// POST
export const getAppointmentById = async (req, res) => {
  const { appointment_id } = req.body;
  try {
    const result = await pool.query(
      `SELECT * FROM appointment WHERE appointment_id = $1`,
      [appointment_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "Appointment not found" });
    }

    res.json({ status: "ok", appointment: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error getting appointment" });
  }
};

// GET
export const getAllAppointment = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM appointment ORDER BY appointment_id ASC`
    );
    res.json({ status: "ok", appointments: result.rows });
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Error getting all appointment" });
  }
};

// DELETE
export const deleteAppointmentById = async (req, res) => {
  const { appointment_id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM appointment WHERE appointment_id = $1 RETURNING *`,
      [appointment_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "Appointment not found" });
    }

    res.json({ status: "ok", msg: "Appointment deleted" });
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Error deleting appointment" });
  }
};
