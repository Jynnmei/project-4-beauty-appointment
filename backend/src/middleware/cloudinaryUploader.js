import cloudinary from "./cloudinary.js";
import streamifier from "streamifier";

// 上传 buffer 到 Cloudinary，返回结果
export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "vendor_price_images" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// 从 Cloudinary url 提取 public_id
export const extractCloudinaryPublicId = (url) => {
  try {
    const parts = url.split("/");
    const filenameWithExt = parts.pop(); // e.g. filename.jpg
    const filename = filenameWithExt.split(".")[0]; // filename
    const uploadIndex = parts.indexOf("upload");
    const folderPath = parts.slice(uploadIndex + 1).join("/"); // folder path
    return folderPath ? `${folderPath}/${filename}` : filename;
  } catch (err) {
    return null;
  }
};
