import express from "express";
import {
  createAppointment,
  deleteAppointmentById,
  getAllAppointment,
  getAllServices,
  getAppointmentById,
  updateAppointment,
} from "../controllers/appointments.js";
import {
  validateCreateAppointmentData,
  validateIdInBody,
  validateIdInParam,
  validateUpdateAppointmentData,
} from "../validators/appointments.js";
import checkError from "../validators/checkError.js";
import { authClient } from "../middleware/auth.js";

const router = express.Router();

router.get("/services", checkError, getAllServices);

router.put(
  "/",
  authClient,
  validateCreateAppointmentData,
  checkError,
  createAppointment
);

router.patch(
  "/:appointment_id",
  authClient,
  validateIdInParam,
  validateUpdateAppointmentData,
  checkError,
  updateAppointment
);

router.post("/", authClient, validateIdInBody, checkError, getAppointmentById);

router.get("/", checkError, getAllAppointment);

router.delete(
  "/:appointment_id",
  authClient,
  validateIdInParam,
  checkError,
  deleteAppointmentById
);

export default router;
