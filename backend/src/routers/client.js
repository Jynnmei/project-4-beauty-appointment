import express from "express";
import checkError from "../validators/checkError.js";
import { authClient } from "../middleware/auth.js";
import { getServices, getTypes, getVendor } from "../controllers/client.js";

const router = express.Router();

router.get("/", authClient, checkError, getVendor);
router.get("/types", authClient, checkError, getTypes);
router.get("/service", authClient, checkError, getServices);

export default router;
