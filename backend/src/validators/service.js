import { body, param } from "express-validator";

export const validateIdInParam = [
  param("service_id ", "service_id  must be an integer")
    .notEmpty()
    .isInt({ gt: 0 }),
];

export const validateCreateServiceData = [
  body("vendor_id", "vendor_id is required").notEmpty(),
  body("vendor_id", "vendor_id must be an integer").isInt(),

  body("catalog_id", "catalog_id is required").notEmpty(),
  body("catalog_id", "catalog_id must be an integer").isInt(),
];

export const validateUpdateServiceData = [
  body("vendor_id", "vendor_id is required").optional().notEmpty(),
  body("vendor_id", "vendor_id must be an integer").optional().isInt(),

  body("catalog_id", "catalog_id is required").optional().notEmpty(),
  body("catalog_id", "catalog_id must be an integer").optional().isInt(),
];
