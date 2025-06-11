import { pool } from "../db/db.js";

// PUT - 顾客 create appointment
export const createAppointment = async (req, res) => {
  console.log("Appointment PUT req.body:", req.body);
  const { client_id, type_ids, vendor_ids, service_ids, appointment_datetime } =
    req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const now = new Date();
    const apptDate = new Date(appointment_datetime);

    // Validation 1: Cannot book past dates
    if (apptDate < now) {
      return res
        .status(400)
        .json({ status: "error", msg: "Cannot book a past date" });
    }

    // Validation 2: Cannot book more than 3 months ahead
    const maxBookingDate = new Date();
    maxBookingDate.setMonth(now.getMonth() + 3);
    if (apptDate > maxBookingDate) {
      return res
        .status(400)
        .json({ status: "error", msg: "Can only book within 3 months" });
    }

    // Get current month's start and end range
    const getMonthRange = (date) => {
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    };
    const { start: monthStart, end: monthEnd } = getMonthRange(apptDate);

    // Validation 3: Each client can only book max 2 appointments per month
    const countQuery = `
      SELECT COUNT(*) FROM appointment 
      WHERE client_id = $1 
      AND appointment_datetime BETWEEN $2 AND $3
    `;
    const { rows } = await client.query(countQuery, [
      client_id,
      monthStart.toISOString(),
      monthEnd.toISOString(),
    ]);

    if (parseInt(rows[0].count) >= 2) {
      return res.status(400).json({
        status: "error",
        msg: "You can only book 2 appointments per month",
      });
    }

    // Insert into appointment table
    const appointmentQuery = `
      INSERT INTO appointment (client_id, appointment_datetime)
      VALUES ($1, $2)
      RETURNING *`;
    const appointmentValues = [client_id, appointment_datetime];
    const appointmentResult = await client.query(
      appointmentQuery,
      appointmentValues
    );
    const appointment_id = appointmentResult.rows[0].appointment_id;

    // Insert into appointment_type table
    if (Array.isArray(type_ids)) {
      for (const type_id of type_ids) {
        await client.query(
          `INSERT INTO appointment_type (appointment_id, type_id) VALUES ($1, $2)`,
          [appointment_id, type_id]
        );
      }
    } else if (type_ids) {
      await client.query(
        `INSERT INTO appointment_type (appointment_id, type_id) VALUES ($1, $2)`,
        [appointment_id, type_ids]
      );
    }

    // Insert into appointment_service table
    if (Array.isArray(service_ids)) {
      for (const service_id of service_ids) {
        await client.query(
          `INSERT INTO appointment_service (appointment_id, service_id) VALUES ($1, $2)`,
          [appointment_id, service_id]
        );
      }
    } else if (service_ids) {
      await client.query(
        `INSERT INTO appointment_service (appointment_id, service_id) VALUES ($1, $2)`,
        [appointment_id, service_ids]
      );
    }

    // Insert into appointment_vendor table
    if (Array.isArray(vendor_ids)) {
      for (const vendor_id of vendor_ids) {
        await client.query(
          `INSERT INTO appointment_vendor (appointment_id, vendor_id) VALUES ($1, $2)`,
          [appointment_id, vendor_id]
        );
      }
    } else if (vendor_ids) {
      await client.query(
        `INSERT INTO appointment_vendor (appointment_id, vendor_id) VALUES ($1, $2)`,
        [appointment_id, vendor_ids]
      );
    }

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

// PATCH - 顾客更改预约
export const updateAppointment = async (req, res) => {
  const { appointment_id } = req.params;
  const { client_id, type_ids, vendor_ids, service_ids, appointment_datetime } =
    req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateMainQuery = `
      UPDATE appointment
      SET
        client_id = COALESCE($1, client_id),
        appointment_datetime = COALESCE($2, appointment_datetime )
      WHERE appointment_id = $3
      RETURNING *;
      `;
    const result = await client.query(updateMainQuery, [
      client_id !== undefined ? client_id : null,
      appointment_datetime !== undefined ? appointment_datetime : null,
      appointment_id,
    ]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "Appointment not found" });
    }

    // delete & create type
    if (type_ids !== undefined) {
      await client.query(
        `DELETE FROM appointment_type WHERE appointment_id = $1`,
        [appointment_id]
      );

      if (Array.isArray(type_ids)) {
        for (const type_id of type_ids) {
          await client.query(
            `INSERT INTO appointment_type (appointment_id, type_id) VALUES ($1, $2)`,
            [appointment_id, type_id]
          );
        }
      } else if (type_ids) {
        await client.query(
          `INSERT INTO appointment_type (appointment_id, type_id) VALUES ($1, $2)`,
          [appointment_id, type_ids]
        );
      }
    }

    // delete & create service
    if (service_ids !== undefined) {
      await client.query(
        `DELETE FROM appointment_service WHERE appointment_id = $1`,
        [appointment_id]
      );

      if (Array.isArray(service_ids)) {
        for (const service_id of service_ids) {
          await client.query(
            `INSERT INTO appointment_service (appointment_id, service_id) VALUES ($1, $2)`,
            [appointment_id, service_id]
          );
        }
      } else if (service_ids) {
        await client.query(
          `INSERT INTO appointment_service (appointment_id, service_id) VALUES ($1, $2)`,
          [appointment_id, service_ids]
        );
      }
    }

    // delete & create vendor
    if (vendor_ids !== undefined) {
      await client.query(
        `DELETE FROM appointment_vendor WHERE appointment_id = $1`,
        [appointment_id]
      );

      if (Array.isArray(vendor_ids)) {
        for (const vendor_id of vendor_ids) {
          await client.query(
            `INSERT INTO appointment_vendor (appointment_id, vendor_id) VALUES ($1, $2)`,
            [appointment_id, vendor_id]
          );
        }
      } else if (vendor_ids) {
        await client.query(
          `INSERT INTO appointment_vendor (appointment_id, vendor_id) VALUES ($1, $2)`,
          [appointment_id, vendor_ids]
        );
      }
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
