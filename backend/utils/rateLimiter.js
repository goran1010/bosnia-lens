import rateLimit from "express-rate-limit";

const global = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: {
    error: "Too many requests. Please wait 15 minutes, then try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const auth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "test" ? 1000 : 10,
  message: {
    error: "Too many login attempts. Please wait 15 minutes, then try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const api = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: "Too many API requests. Please wait 15 minutes, then try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const users = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: "Too many requests. Please wait 15 minutes, then try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { global, auth, api, users };
