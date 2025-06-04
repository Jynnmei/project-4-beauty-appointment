import express from "express";
import checkError from "../validators/checkError.js";
import {
  createService,
  deleteServiceById,
  getAllServices,
  updateService,
} from "../controllers/service.js";
import {
  validateCreateServiceData,
  validateIdInParam,
  validateUpdateServiceData,
} from "../validators/service.js";

const router = express.Router();

router.get("/", checkError, getAllServices);

router.put("/", validateCreateServiceData, checkError, createService);

router.patch(
  "/:catalog_id",
  validateIdInParam,
  validateUpdateServiceData,
  checkError,
  updateService
);

router.delete("/:catalog_id", validateIdInParam, checkError, deleteServiceById);

export default router;
