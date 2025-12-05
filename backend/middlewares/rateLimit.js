import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  keyGenerator: (req, res) => req.user?.id || ipKeyGenerator(req, res),
  message: {
    success: false,
    error: "Too many requests!!",
  },
});

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many login attempts. Try again later.",
});
