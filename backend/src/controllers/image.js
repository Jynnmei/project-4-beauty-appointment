import { pool } from "../db/db.js";
import cloudinary from "../middleware/cloudinary.js";
import {
  extractCloudinaryPublicId,
  uploadToCloudinary,
} from "../middleware/cloudinaryUploader.js";

// GET
export const getAllImages = async (req, res) => {
  const { vendor_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM vendor_price_images WHERE vendor_id = $1`,
      [vendor_id]
    );

    res.json({ status: "ok", data: result.rows });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to fetch images" });
  }
};

// PUT
export const createMultipleImages = async (req, res) => {
  const { vendor_id } = req.params;
  const files = req.files;

  if (!vendor_id) {
    return res
      .status(400)
      .json({ status: "error", msg: "vendor_id is required" });
  }

  if (!files || files.length === 0) {
    return res.status(400).json({ status: "error", msg: "No images uploaded" });
  }

  try {
    const uploadedImages = [];

    // 上传每张图片到 Cloudinary 并保存 URL
    for (const file of files) {
      const result = await uploadToCloudinary(file.buffer);

      // 插入数据库
      const dbResult = await pool.query(
        `INSERT INTO vendor_price_images (vendor_id, image_url) VALUES ($1, $2) RETURNING *`,
        [vendor_id, result.secure_url]
      );

      uploadedImages.push(dbResult.rows[0]);
    }

    res.json({ status: "ok", msg: "Images uploaded and saved" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Upload images failed" });
  }
};

// PATCH
export const updateVendorPriceImage = async (req, res) => {
  const { vendor_price_images_id } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ status: "error", msg: "No image uploaded" });
  }

  try {
    // 查旧图 URL
    const result = await pool.query(
      `SELECT image_url FROM vendor_price_images WHERE id = $1`,
      [vendor_price_images_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: "error", msg: "Image not found" });
    }

    const oldUrl = result.rows[0].image_url;
    const publicId = extractCloudinaryPublicId(oldUrl);

    // 删除旧图
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    // 上传新图
    const uploadResult = await uploadToCloudinary(file.buffer);

    // 更新数据库中的 image_url
    const updateResult = await pool.query(
      `UPDATE vendor_price_images SET image_url = $1 WHERE id = $2 RETURNING *`,
      [uploadResult.secure_url, vendor_price_images_id]
    );

    res.json({ status: "ok", msg: "Image updated" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to update image" });
  }
};

// DELETE
export const deleteVendorPriceImage = async (req, res) => {
  const { vendor_price_images_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT image_url FROM vendor_price_images WHERE id = $1`,
      [vendor_price_images_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "Image not found in database" });
    }

    const imageUrl = result.rows[0].image_url;

    // 从 image_url 提取 public_id
    const publicId = extractCloudinaryPublicId(imageUrl);

    if (!publicId) {
      return res
        .status(400)
        .json({ status: "error", msg: "Invalid Cloudinary image URL" });
    }

    // 删除 Cloudinary 文件
    await cloudinary.uploader.destroy(publicId);

    await pool.query(`DELETE FROM vendor_price_images WHERE id = $1`, [
      vendor_price_images_id,
    ]);

    res.json({ status: "ok", msg: "Image deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      status: "error",
      msg: "Error deleting image",
    });
  }
};
