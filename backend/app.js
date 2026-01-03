import "dotenv/config";
import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";

const currentURL = process.env.URL;

if (!process.env.URL) {
  throw new Error("Missing required environment variable: process.env.URL");
}

app.use(cookieParser());

app.use(
  cors({
    origin: [currentURL, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposedHeaders: ["Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import path from "node:path";

const assetsPath = path.join(import.meta.dirname, "public");
app.use(express.static(assetsPath));

import apiRouter from "./routes/apiRouter.js";
import authRouter from "./routes/authRouter.js";
import usersRouter from "./routes/usersRouter.js";

app.use("/api/v1/", apiRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ error: "No resource found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

export default app;
