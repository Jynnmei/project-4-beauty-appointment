import { body, param } from "express-validator";

export const validateIdInBody = [
  body("appointment_id", "appointment_id must be an integer")
    .notEmpty()
    .isInt({ gt: 0 }),
];

export const validateIdInParam = [
  param("appointment_id", "appointment_id must be an integer")
    .notEmpty()
    .isInt({ gt: 0 }),
];

export const validateCreateAppointmentData = [
  body("client_id", "client_id is required").notEmpty(),
  body("client_id", "client_id must be an integer").isInt(),

  body("type_id", "type_id is required").notEmpty(),
  body("type_id", "type_id must be an integer").isInt(),

  body("vendor_id", "vendor_id is required").notEmpty(),
  body("vendor_id", "vendor_id must be an integer").isInt(),

  body("service_id", "service_id is required").notEmpty(),
  body("service_id", "service_id must be an integer").isInt(),

  body("appointment_datetime", "appointment_datetime is required").notEmpty(),
  body(
    "appointment_datetime",
    "appointment_datetime must be a valid ISO 8601 datetime"
  )
    .isISO8601()
    .toDate(),
];

export const validateUpdateAppointmentData = [
  body("client_id", "client_id is required").optional().notEmpty(),
  body("client_id", "client_id must be an integer").optional().isInt(),

  body("type_id", "type_id is required").optional().notEmpty(),
  body("type_id", "type_id must be an integer").optional().isInt(),

  body("vendor_id", "vendor_id is required").optional().notEmpty(),
  body("vendor_id", "vendor_id must be an integer").optional().isInt(),

  body("service_id", "service_id is required").optional().notEmpty(),
  body("service_id", "service_id must be an integer").optional().isInt(),

  body("appointment_datetime", "appointment_datetime is required")
    .optional()
    .notEmpty(),
  body(
    "appointment_datetime",
    "appointment_datetime must be a valid ISO 8601 datetime"
  )
    .optional()
    .isISO8601()
    .toDate(),
];
