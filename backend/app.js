import "dotenv/config";
import express from "express";
const app = express();
import cors from "cors";
import "./config/envCheck.js";
import { sessionMiddleware } from "./config/sessionMiddleware.js";
import { passport } from "./config/passport.js";
import helmet from "helmet";
import * as rateLimiter from "./utils/rateLimiter.js";

import { apiRouter } from "./routes/apiRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { usersRouter } from "./routes/usersRouter.js";
import { isAuthenticated } from "./auth/isAuthenticated.js";
import { isNotAuthenticated } from "./auth/isNotAuthenticated.js";

const currentURL = process.env.URL;

// Trust first proxy (required for Koyeb)
app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: [currentURL, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);

app.use(rateLimiter.global);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);
app.use(passport.session());

app.use("/api/v1/", rateLimiter.api, apiRouter);
app.use("/auth", rateLimiter.auth, isNotAuthenticated, authRouter);
app.use("/users", rateLimiter.users, isAuthenticated, usersRouter);

app.use((req, res) => {
  res
    .status(404)
    .json({ error: "No resource found", details: [{ msg: null }] });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal Server Error",
    details: [{ msg: err.message || "An unexpected error occurred." }],
  });
});

export { app };
