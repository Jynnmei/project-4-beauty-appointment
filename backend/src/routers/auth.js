import express from "express";
import { register, login, refresh, getRoles } from "../controllers/auth.js";
import {
  validateLoginData,
  validateRegistrationData,
} from "../validators/auth.js";
import checkError from "../validators/checkError.js";

const router = express.Router();

router.put("/register", validateRegistrationData, checkError, register);
router.get("/roles", checkError, getRoles);
router.post("/login", validateLoginData, checkError, login);
router.post("/refresh", refresh);

export default router;
