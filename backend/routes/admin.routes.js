import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import {
  upload,
  uploadFacultyDetails,
  uploadSyllabus,
  uploadTimeTable,
} from "../controllers/admin.controller.js";
const router = express.Router();

router.post(
  "/upload-syllabus",
  authMiddleware,
  adminMiddleware,
  upload.single("file"),
  uploadSyllabus
);

router.post(
  "/upload-timetable",
  authMiddleware,
  adminMiddleware,
  upload.single("file"),
  uploadTimeTable
);

router.post(
  "/upload-faculty",
  authMiddleware,
  adminMiddleware,
  upload.single("file"),
  uploadFacultyDetails
);

export default router;
