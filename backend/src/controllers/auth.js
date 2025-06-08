import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";

export const register = async (req, res) => {
  const {
    username = "",
    address = "",
    email = "",
    hash_password = "",
    phone = "",
    role_id = 1,
  } = req.body;

  try {
    const existing = await pool.query(
      `SELECT * FROM users WHERE email = $1 OR username = $2`,
      [email, username]
    );

    if (existing.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Email or username already taken" });
    }

    const hashed = await bcrypt.hash(hash_password, 12);

    const result = await pool.query(
      `INSERT INTO users (username, address, email, hash_password, phone, role_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING user_id, username, email`,
      [username, address, email, hashed, phone, role_id]
    );

    res.json({ status: "ok", msg: "User created" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", message: "Invalid registration" });
  }
};

export const getRoles = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM roles");
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Failed to fetch roles" });
  }
};

export const login = async (req, res) => {
  const { email = "", hash_password = "" } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(hash_password, user.hash_password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const claims = {
      user_id: user.user_id,
      username: user.username,
      role_id: user.role_id,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });

    res.json({ access, refresh });
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: "Login failed" });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refresh } = req.body;

    if (!refresh) {
      return res.status(400).json({ status: "error", msg: "No refresh token" });
    }

    const decoded = jwt.verify(refresh, process.env.REFRESH_SECRET);

    const claims = {
      user_id: decoded.user_id,
      username: decoded.username,
      role_id: decoded.role_id,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    res.json({ access });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "login refresh error" });
  }
};
