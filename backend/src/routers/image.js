import express from "express";
import multer from "../middleware/multer.js";
import {
  createMultipleImages,
  deleteVendorPriceImage,
  getAllImages,
  updateVendorPriceImage,
} from "../controllers/image.js";

const router = express.Router();

router.get("/:vendor_id", getAllImages);

router.put("/:vendor_id", multer.array("images", 10), createMultipleImages);

router.patch("/:id", multer.single("images"), updateVendorPriceImage);

router.delete("/:id", deleteVendorPriceImage);

export default router;
