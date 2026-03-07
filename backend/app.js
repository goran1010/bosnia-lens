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

import { apiRouter } from "./routes/apiRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { usersRouter } from "./routes/usersRouter.js";
import { isAuthenticated } from "./auth/isAuthenticated.js";
import { isNotAuthenticated } from "./auth/isNotAuthenticated.js";

const currentURL = process.env.URL;

// Trust first proxy (required for Koyeb)
app.set("trust proxy", 1);

app.use(helmet());

app.use("/api/v1/", cors(), rateLimiter.api, apiRouter);

app.use(
  cors({
    origin: [currentURL],
    credentials: true,
  }),
);

app.use(rateLimiter.global);

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
  console.error(JSON.stringify(err));
  res.status(err.statusCode || 500).json({
    error: "An unexpected error occurred.",
    details: [{ msg: err.message }],
  });
});

export { app };
