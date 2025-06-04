import { pool } from "../db/db.js";

// PUT
export const createStatus = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO status (name) VALUES ($1) RETURNING *`,
      [name]
    );
    res.json({ status: "ok", msg: "Status created", data: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to create status" });
  }
};

// PATCH
export const updateAppointmentStatus = async (req, res) => {
  const { appointment_id } = req.params;
  const { status_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE appointment
       SET status_id = $1, updated_at = CURRENT_TIMESTAMP
       WHERE appointment_id = $2
       RETURNING *`,
      [status_id, appointment_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "Appointment not found" });
    }

    res.json({ status: "ok", msg: "Appointment status updated" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ status: "error", msg: "Failed to update status" });
  }
};

// DELETE
export const deleteStatus = async (req, res) => {
  const { status_id } = req.body;

  try {
    const result = await pool.query(
      `DELETE FROM status WHERE id = $1 RETURNING *`,
      [status_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: "error", msg: "Status not found" });
    }

    res.json({ status: "ok", msg: "Status deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(400).json({ status: "error", msg: "Failed to delete status" });
  }
};
