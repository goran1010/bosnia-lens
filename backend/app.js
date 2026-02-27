import "dotenv/config";
import express from "express";
const app = express();
import cors from "cors";
import "./config/envCheck.js";
import { sessionMiddleware } from "./config/sessionMiddleware.js";
import { passport } from "./config/passport.js";
import helmet from "helmet";
import {
  globalRateLimiter,
  apiRateLimiter,
  authRateLimiter,
} from "./utils/rateLimiter.js";

import { apiRouter } from "./routes/apiRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { usersRouter } from "./routes/usersRouter.js";
import { adminRouter } from "./routes/adminRouter.js";
import { isAdmin } from "./auth/isAdmin.js";
import { contributorRouter } from "./routes/contributorRouter.js";
import { isContributor } from "./auth/isContributor.js";

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

app.use(globalRateLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);
app.use(passport.session());

app.use("/api/v1/", apiRateLimiter, apiRouter);
app.use("/auth", authRouter);
app.use("/users", authRateLimiter, usersRouter);
app.use("/admin", isAdmin, adminRouter);
app.use("/contributor", isContributor, contributorRouter);

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
