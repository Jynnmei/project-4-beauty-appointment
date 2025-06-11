import { body, param } from "express-validator";

export const validateIdInParam = [
  param("appointment_id", "appointment_id must be an integer")
    .notEmpty()
    .isInt({ gt: 0 }),
];

export const validateUpdateAppointmentVendor = [
  body("vendor_id ", "vendor_id  is required").optional().notEmpty(),
  body("vendor_id ", "vendor_id  must be an integer").optional().isInt(),
];

export const validateUpdateAppointmentService = [
  body("service_id ", "service_id  is required").optional().notEmpty(),
  body("service_id ", "service_id  must be an integer").optional().isInt(),
];
