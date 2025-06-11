import { pool } from "../db/db.js";

// GET
export const getAllServices = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM service");
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to get services" });
  }
};

// GET by ID
export const getServicesById = async (req, res) => {
  const { service_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM service WHERE service_id = $1",
      [service_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to get services" });
  }
};

// PUT
export const createService = async (req, res) => {
  const { vendor_id, catalog_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO service (vendor_id, catalog_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [vendor_id, catalog_id]
    );

    res.json({ status: "ok", msg: "Service added" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to add service" });
  }
};

// PATCH - catalog
export const updateService = async (req, res) => {
  const { service_id } = req.params;
  const { vendor_id, catalog_id } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE service SET vendor_id = $1, catalog_id = $2 WHERE service_id = $3 RETURNING *;
    `,
      [vendor_id, catalog_id, service_id]
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
  const { service_id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM service WHERE service_id = $1 RETURNING *`,
      [service_id]
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
