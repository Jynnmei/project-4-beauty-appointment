import express from "express";
import checkError from "../validators/checkError.js";
import {
  addAppointmentService,
  addAppointmentVendor,
  deleteAppointmentService,
  deleteAppointmentVendor,
  getAppointmentServices,
  getAppointmentVendorsById,
  updateAppointmentService,
  updateAppointmentVendor,
  getAppointmentVendors,
} from "../controllers/appointmentRelations.js";
import {
  validateUpdateAppointmentVendor,
  validateUpdateAppointmentService,
  validateIdInParam,
} from "../validators/appointmentRelations.js";
import { authClient, authVendor } from "../middleware/auth.js";

const router = express.Router();

router.get("/vendors", authVendor, checkError, getAppointmentVendors);
router.get(
  "/vendor/:appointment_id",
  authClient,
  checkError,
  getAppointmentVendorsById
);
router.post("/vendor", authClient, checkError, addAppointmentVendor);
router.patch(
  "/vendor/:appointment_id",
  authClient,
  validateIdInParam,
  validateUpdateAppointmentVendor,
  checkError,
  updateAppointmentVendor
);
router.delete(
  "/vendor/:appointment_id/:vendor_id",
  checkError,
  deleteAppointmentVendor
);

router.get("/service/:appointment_id", checkError, getAppointmentServices);
router.post("/service", checkError, addAppointmentService);
router.patch(
  "/service/:appointment_id",
  authClient,
  validateIdInParam,
  validateUpdateAppointmentService,
  checkError,
  updateAppointmentService
);
router.delete(
  "/service/:appointment_id/:service_id",
  checkError,
  deleteAppointmentService
);

export default router;
