import rateLimit from "express-rate-limit";

const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: {
    error: "Too many requests. Please wait 15 minutes, then try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    error: "Too many login attempts. Please wait 15 minutes, then try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: "Too many API requests. Please wait 15 minutes, then try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { globalRateLimiter, authRateLimiter, apiRateLimiter };
