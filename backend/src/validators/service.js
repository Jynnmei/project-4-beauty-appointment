import { body, param } from "express-validator";

export const validateIdInBody = [
  body("catalog_id", "catalog_id must be an integer")
    .notEmpty()
    .isInt({ gt: 0 }),
];

export const validateIdInParam = [
  param("catalog_id", "catalog_id must be an integer")
    .notEmpty()
    .isInt({ gt: 0 }),
];

export const validateCreateServiceData = [
  body("title", "title is required").notEmpty(),
  body("title", "title must be a string").isString(),

  body("description", "description is required").notEmpty(),
  body("description", "description must be a string").isString(),

  body("price", "price is required").notEmpty(),
  body("price", "price must be a decimal number").isFloat(),

  body("duration", "duration is required").notEmpty(),
  body("duration", "duration must be an integer").isInt(),
];

export const validateUpdateServiceData = [
  body("title", "title is required").optional().notEmpty(),
  body("title", "title must be a string").optional().isString(),

  body("description", "description is required").optional().notEmpty(),
  body("description", "description must be a string").optional().isString(),

  body("price", "price is required").optional().notEmpty(),
  body("price", "price must be a decimal number").optional().isFloat(),

  body("duration", "duration is required").optional().notEmpty(),
  body("duration", "duration must be an integer").optional().isInt(),
];
