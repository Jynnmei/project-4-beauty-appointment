import { param } from "express-validator";

export const validateIdInParam = [
  param("user_id", "user_id must be an integer").notEmpty().isInt({ gt: 0 }),
];
