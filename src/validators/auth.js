import { body } from "express-validator";

export const validateRegistrationData = [
  body("username", "username is required").notEmpty(),
  body("username", "username min is 1 and max is 50 characters").isLength({
    min: 1,
    max: 50,
  }),
  body("address", "address is required").notEmpty(),
  body("address", "address min is 1 and max is 100 characters").isLength({
    min: 1,
    max: 100,
  }),
  body("email", "email is required").notEmpty(),
  body("email", "email min is 5 and max is 100 characters").isLength({
    min: 5,
    max: 100,
  }),
  body("hash_password", "password is required").notEmpty(),
  body("hash_password", "password min is 5 and max is 50 characters").isLength({
    min: 5,
    max: 50,
  }),

  body("phone", "phone is required").notEmpty(),
  body("phone", "phone must be exactly 8 digits").isLength({ min: 8, max: 8 }),

  body("role_id", "role_id is required").notEmpty(),
  body("role_id", "role_id must be an integer").isInt(),
];

export const validateLoginData = [
  body("email", "email is required").notEmpty(),
  body("hash_password", "password is required").notEmpty(),
];
