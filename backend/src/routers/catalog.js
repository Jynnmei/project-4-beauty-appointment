import express from "express";
import checkError from "../validators/checkError.js";
import {
  createService,
  deleteServiceById,
  getAllServices,
  updateService,
} from "../controllers/catalog.js";
import {
  validateCreateServiceData,
  validateIdInParam,
  validateUpdateServiceData,
} from "../validators/catalog.js";
import { authVendor } from "../middleware/auth.js";

const router = express.Router();

router.get("/", checkError, getAllServices);

router.put(
  "/",
  authVendor,
  validateCreateServiceData,
  checkError,
  createService
);

router.patch(
  "/:catalog_id",
  authVendor,
  validateIdInParam,
  validateUpdateServiceData,
  checkError,
  updateService
);

router.delete(
  "/:catalog_id",
  authVendor,
  validateIdInParam,
  checkError,
  deleteServiceById
);

export default router;
