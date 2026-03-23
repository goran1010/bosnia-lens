import "dotenv/config";
import express from "express";
const app = express();

import cors from "cors";
import "./config/envCheck.js";
import { sessionMiddleware } from "./config/sessionMiddleware.js";
import { passport } from "./config/passport.js";

import helmet from "helmet";
import * as rateLimiter from "./utils/rateLimiter.js";
import { csrfSync } from "csrf-sync";
import { csrfRouter } from "./routes/csrfRouter.js";
const { csrfSynchronisedProtection } = csrfSync();

import compression from "compression";
import pino from "pino";

const logger = pino({
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});

import { apiRouter } from "./routes/apiRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { usersRouter } from "./routes/usersRouter.js";
import { isAuthenticated } from "./auth/isAuthenticated.js";
import { isNotAuthenticated } from "./auth/isNotAuthenticated.js";

const FRONTEND_URL = process.env.FRONTEND_URL;

// Simulate a long wait for testing purposes (remove in production)
// let serverAsleep = true;

// let serverAsleep = true;
// app.use((req, res, next) => {
//   if (serverAsleep) {
//     setTimeout(() => {
//       serverAsleep = false;
//       next();
//     }, 18000);
//   } else next();
// });
// ---------------------------------------------------------------

// Trust first proxy (required for Koyeb)
app.set("trust proxy", 1);

app.use(rateLimiter.global);

// Log every request made to the server
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} ${req.ip}`);
  next();
});

app.use(helmet());
app.use(compression());

// Public API routes
app.use("/api", cors(), rateLimiter.api, apiRouter);
// -----------------

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);
app.use(passport.session());

app.use(csrfRouter);

app.use(
  "/auth",
  rateLimiter.auth,
  csrfSynchronisedProtection,
  isNotAuthenticated,
  authRouter,
);
app.use(
  "/users",
  rateLimiter.users,
  csrfSynchronisedProtection,
  isAuthenticated,
  usersRouter,
);

app.use((req, res) => {
  res
    .status(404)
    .json({ error: "No resource found", details: [{ msg: null }] });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(JSON.stringify(err));

  res.status(err.statusCode || 500).json({
    error: "An unexpected error occurred.",
    details: [{ msg: err.message }],
  });
});

export { app };
