import express from "express";
import checkError from "../validators/checkError.js";
import { authVendor } from "../middleware/auth.js";
import {
  addService,
  deleteService,
  getVendorAppointments,
} from "../controllers/vendor.js";
import {
  validateAddServiceData,
  validateIdInParam,
} from "../validators/vendor.js";

const router = express.Router();

router.get("/:vendor_id", authVendor, checkError, getVendorAppointments);

router.post("/", authVendor, validateAddServiceData, checkError, addService);
router.delete(
  "/:service_id",
  authVendor,
  validateIdInParam,
  checkError,
  deleteService
);

export default router;
