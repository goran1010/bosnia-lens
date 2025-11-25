import express from "express";
const app = express();
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
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
