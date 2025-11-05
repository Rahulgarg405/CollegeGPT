import multer from "multer";
import fs from "fs";
import { indexDocument } from "./index.controller.js";

export const upload = multer({ dest: "uploads/" });

export const uploadSyllabus = async (req, res) => {
  try {
    const { semester, branch } = req.body;
    if (!semester) {
      return res.status(400).json({ error: "Semester is required" });
    }

    if (!branch) {
      return res.status(400).json({ error: "Branch is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const filePath = req.file.path;

    const result = await indexDocument(filePath, semester, branch);

    fs.unlinkSync(filePath);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const uploadTimeTable = async (req, res) => {
  try {
    const { semester, branch } = req.body;
    if (!semester || !branch)
      return res
        .status(400)
        .json({ error: "Semester and Branch are required" });

    if (!req.file)
      return res.status(400).json({ error: "PDF file is required" });

    const filePath = req.file.path;

    const result = await indexDocument(filePath, semester, branch, "timetable");

    fs.unlinkSync(filePath);
    res.json({ success: true, message: result.message });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const uploadFacultyDetails = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "PDF file is required" });

    const filePath = req.file.path;

    const result = await indexDocument(filePath, null, null, "faculty");

    fs.unlinkSync(filePath);
    res.json({ success: true, message: result.message });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
