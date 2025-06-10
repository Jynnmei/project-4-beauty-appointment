import { pool } from "../db/db.js";

// PUT
export const createAppointment = async (req, res) => {
  const { client_id, type_id, vendor_id, service_id, appointment_datetime } =
    req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // appointment table
    const appointmentQuery = `
      INSERT INTO appointment (client_id, type_id, vendor_id, service_id, appointment_datetime)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const appointmentValues = [
      client_id,
      type_id,
      vendor_id,
      service_id,
      appointment_datetime,
    ];
    const appointmentResult = await client.query(
      appointmentQuery,
      appointmentValues
    );
    const appointment_id = appointmentResult.rows[0].appointment_id;

    // appointment_service table
    await client.query(
      `INSERT INTO appointment_service (appointment_id, service_id) VALUES ($1, $2)`,
      [appointment_id, service_id]
    );

    // appointment_vendor table
    await client.query(
      `INSERT INTO appointment_vendor (appointment_id, vendor_id) VALUES ($1, $2)`,
      [appointment_id, vendor_id]
    );

    await client.query("COMMIT");
    res.json({ status: "ok", msg: "Appointment created" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Failed to create appointment" });
  } finally {
    client.release();
  }
};

// PATCH
export const updateAppointment = async (req, res) => {
  const { appointment_id } = req.params;
  const { client_id, type_id, vendor_id, service_id, appointment_datetime } =
    req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateMainQuery = `
      UPDATE appointment
      SET
        client_id = COALESCE($1, client_id),
        type_id = COALESCE($2, type_id),
        vendor_id = COALESCE($3, vendor_id),
        service_id = COALESCE($4, service_id),
        appointment_datetime = COALESCE($5, appointment_datetime )
      WHERE appointment_id = $6
      RETURNING *;
      `;
    const result = await client.query(updateMainQuery, [
      client_id,
      type_id !== undefined ? type_id : null,
      vendor_id !== undefined ? vendor_id : null,
      service_id !== undefined ? service_id : null,
      appointment_datetime !== undefined ? appointment_datetime : null,
      appointment_id,
    ]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "Appointment not found" });
    }

    // delete old data
    await client.query(
      `DELETE FROM appointment_service WHERE appointment_id = $1`,
      [appointment_id]
    );
    await client.query(
      `DELETE FROM appointment_vendor WHERE appointment_id = $1`,
      [appointment_id]
    );

    // insert new data
    if (service_id) {
      await client.query(
        `INSERT INTO appointment_service (appointment_id, service_id) VALUES ($1, $2)`,
        [appointment_id, service_id]
      );
    }

    if (vendor_id) {
      await client.query(
        `INSERT INTO appointment_vendor (appointment_id, vendor_id) VALUES ($1, $2)`,
        [appointment_id, vendor_id]
      );
    }

    await client.query("COMMIT");
    res.json({ status: "ok", msg: "Appointment updated" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Error updating appointment" });
  } finally {
    client.release();
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

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // delete FK
    await client.query(
      `DELETE FROM appointment_service WHERE appointment_id = $1`,
      [appointment_id]
    );
    await client.query(
      `DELETE FROM appointment_vendor WHERE appointment_id = $1`,
      [appointment_id]
    );

    // delete PK
    const result = await client.query(
      `DELETE FROM appointment WHERE appointment_id = $1 RETURNING *`,
      [appointment_id]
    );

    await client.query("COMMIT");

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "Appointment not found" });
    }

    res.json({ status: "ok", msg: "Appointment deleted" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Error deleting appointment" });
  } finally {
    client.release();
  }
};
