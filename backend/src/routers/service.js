import express from "express";
import checkError from "../validators/checkError.js";
import {
  createService,
  deleteServiceById,
  getAllServices,
  updateService,
  updateVendorPriceImageUrl,
} from "../controllers/service.js";
import {
  validateCreateServiceData,
  validateIdInParam,
  validateUpdateServiceData,
} from "../validators/service.js";
import { authVendor } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authVendor, checkError, getAllServices);

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

router.patch(
  "/vendor-price-images/:vendor_price_images_id",
  updateVendorPriceImageUrl
);

export default router;
