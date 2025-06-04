import express from "express";
import { deleteUser, getAllUsers, updateUser } from "../controllers/users.js";
import checkError from "../validators/checkError.js";
import { authVendor } from "../middleware/auth.js";
import { validateIdInParam } from "../validators/users.js";

const router = express.Router();

router.get("/", authVendor, checkError, getAllUsers);
router.patch("/:user_id", validateIdInParam, checkError, updateUser);
router.delete(
  "/:user_id",
  authVendor,
  validateIdInParam,
  checkError,
  deleteUser
);

export default router;
