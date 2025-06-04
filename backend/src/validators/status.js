import { body, param } from "express-validator";

export const validateIdInBody = [
  body("status_id", "status_id must be an integer").notEmpty().isInt({ gt: 0 }),
];

export const validateIdInParam = [
  param("appointment_id", "appointment_id must be an integer")
    .notEmpty()
    .isInt({ gt: 0 }),
];

export const validateCreateStatusData = [
  body("name", "Status name is required").notEmpty(),
  body("name", "Invalid status value").isIn([
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
  ]),
];

export const validateUpdateAppointmentStatusData = [
  body("status_id", "Status ID is required").notEmpty(),
  body("status_id", "Invalid status ID").isInt().isIn([1, 2, 3, 4]),
];
