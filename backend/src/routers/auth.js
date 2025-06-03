import express from "express";
import { register, login, refresh, getAllUsers } from "../controllers/auth.js";
import {
  validateLoginData,
  validateRegistrationData,
} from "../validators/auth.js";
import checkError from "../validators/checkError.js";

const router = express.Router();

router.get("/users", checkError, getAllUsers);
router.put("/register", validateRegistrationData, checkError, register);
router.post("/login", validateLoginData, checkError, login);
router.post("/refresh", refresh);

export default router;
