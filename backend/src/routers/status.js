import express from "express";
import checkError from "../validators/checkError.js";
import {
  createStatus,
  deleteStatus,
  updateAppointmentStatus,
} from "../controllers/status.js";
import { authVendor } from "../middleware/auth.js";
import {
  validateCreateStatusData,
  validateIdInBody,
  validateIdInParam,
  validateUpdateAppointmentStatusData,
} from "../validators/status.js";

const router = express.Router();

router.put("/", authVendor, validateCreateStatusData, checkError, createStatus);
router.patch(
  "/:appointment_id",
  authVendor,
  validateIdInParam,
  validateUpdateAppointmentStatusData,
  checkError,
  updateAppointmentStatus
);

router.delete("/", authVendor, validateIdInBody, checkError, deleteStatus);

export default router;
