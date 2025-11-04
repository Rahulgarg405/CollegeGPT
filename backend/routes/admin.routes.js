import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { upload, uploadSyllabus } from "../controllers/admin.controller.js";
const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  upload.single("file"),
  uploadSyllabus
);

export default router;
