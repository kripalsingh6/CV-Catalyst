import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];

  const ext = file.originalname.toLowerCase();
  const isAllowedExt =
    ext.endsWith(".png") ||
    ext.endsWith(".jpg") ||
    ext.endsWith(".jpeg") ||
    ext.endsWith(".webp") ||
    ext.endsWith(".pdf") ||
    ext.endsWith(".docx") ||
    ext.endsWith(".doc");

  if (allowedMimeTypes.includes(file.mimetype) || isAllowedExt) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, Image (PNG, JPG, WEBP), and Word documents are supported"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export default upload;