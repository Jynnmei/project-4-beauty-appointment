import express from "express";
import {
  createAppointment,
  deleteAppointmentById,
  getAllAppointment,
  getAllServices,
  getAppointmentById,
  updateAppointment,
} from "../controllers/appointments.js";

const router = express.Router();

router.get("/services", getAllServices);
router.put("/", createAppointment);
router.patch("/:appointment_id", updateAppointment);
router.post("/", getAppointmentById);
router.get("/", getAllAppointment);
router.delete("/:appointment_id", deleteAppointmentById);

export default router;
