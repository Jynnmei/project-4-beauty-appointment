import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";

// GET
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT username, role_id FROM users`);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error getting users" });
  }
};

// PATCH - vendor & client
export const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const { username, address, phone } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET 
         username = COALESCE($1, username),
         address = COALESCE($2, address),
         phone = COALESCE($3, phone),
         updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $4
       RETURNING user_id, username, email, address, phone, role_id;`,
      [username, address, phone, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: "error", msg: "User not found" });
    }

    res.json({ status: "ok", msg: "Personal information updated" });
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Failed to update personal information" });
  }
};

// DELETE
export const deleteUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    await pool.query("DELETE FROM appointment WHERE client_id = $1", [user_id]);

    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *",
      [user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ status: "error", msg: "User not found" });
    }

    res.json({ status: "ok", msg: "User deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to delete user" });
  }
};
