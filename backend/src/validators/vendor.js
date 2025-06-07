import { body, param } from "express-validator";

export const validateAddServiceData = [
  body("vendor_id", "vendor_id is required").notEmpty(),
  body("vendor_id", "Invalid status ID").isInt(),

  body("catalog_id", "catalog_id is required").notEmpty(),
  body("catalog_id", "Invalid status ID").isInt(),
];

export const validateIdInParam = [
  param("service_id", "service_id must be an integer")
    .notEmpty()
    .isInt({ gt: 0 }),
];
