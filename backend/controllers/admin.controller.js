import multer from "multer";
import fs from "fs";
import { indexDocument } from "./index.controller.js";

export const upload = multer({ dest: "uploads/" });

export const uploadSyllabus = async (req, res) => {
  try {
    const { semester } = req.body;
    if (!semester) {
      return res.status(400).json({ error: "Semester is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const filePath = req.file.path;

    const result = await indexDocument(filePath, semester);

    fs.unlinkSync(filePath);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    onsole.error("Upload error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
