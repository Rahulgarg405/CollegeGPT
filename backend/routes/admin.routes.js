require("dotenv").config();
const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const router = express.Router();

router.post("/upload", authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    message: "Syllabus uploaded (Admin Only routes).",
  });
});

module.exports = router;
