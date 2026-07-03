const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const User = require("../models/user");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req) => {
    const user = await User.findById(req.params.userId).select("fullName");
    const safeName = user.fullName.trim().replace(/\s+/g, "_");
    return {
      folder: "blogging/profiles",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
      public_id: `${safeName}_${req.params.userId}`,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

module.exports = { upload };
