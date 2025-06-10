import express from "express";
import checkError from "../validators/checkError.js";
import { authClient } from "../middleware/auth.js";
import {
  getAppoinment,
  getServices,
  getTypes,
  getVendor,
  updateAppointmentType,
} from "../controllers/client.js";

const router = express.Router();

router.get("/", authClient, checkError, getVendor);
router.get("/types", authClient, checkError, getTypes);
router.get("/service", authClient, checkError, getServices);
router.get("/appointment", authClient, checkError, getAppoinment);
router.patch("/:appointment_id", authClient, checkError, updateAppointmentType);

export default router;
