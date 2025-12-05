import express from "express";
import chatbot from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { chatLimiter } from "../middlewares/rateLimit.js";
const router = express.Router();

router.post("/chatbot", chatLimiter, authMiddleware, chatbot);

export default router;
