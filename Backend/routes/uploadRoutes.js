import express from "express";
import upload from "../middleware/middleware.upload.js";
import { uploadImage } from "../Controllers/uploadController.js";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);

export default router;