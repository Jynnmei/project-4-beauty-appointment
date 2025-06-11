import { pool } from "../db/db.js";

// GET - catalog
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

// PUT - catalog
export const createService = async (req, res) => {
  const { title, description, price, duration } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO service_catalog (title, description, price, duration)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description, price, duration]
    );

    res.json({ status: "ok", msg: "Service added" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to add service" });
  }
};

// PATCH - catalog
export const updateService = async (req, res) => {
  const { catalog_id } = req.params;
  const { title, description, price, duration } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE service_catalog
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        duration = COALESCE($4, duration)
      WHERE catalog_id = $5
      RETURNING *;
    `,
      [title, description, price, duration, catalog_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "Service not found" });
    }

    res.json({ status: "ok", msg: "Serivce updated" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error updating service" });
  }
};

// DELETE - catalog
export const deleteServiceById = async (req, res) => {
  const { catalog_id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM service_catalog WHERE catalog_id = $1 RETURNING *`,
      [catalog_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "Service not found" });
    }

    res.json({ status: "ok", msg: "Service deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error deleting service" });
  }
};
