import multer from "multer";
import path from "path";

// 直接上传到 Cloudinary, 不保存到本地
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) {
    return cb(new Error("Only .jpg, .jpeg, .png files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
