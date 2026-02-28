import express from "express";
import { csrfSync } from "csrf-sync";
const { generateToken } = csrfSync();

const csrfRouter = express.Router();

csrfRouter.get("/csrf-token", (req, res) => {
  res.json({
    message: "CSRF token generated successfully",
    data: generateToken(req),
  });
});

export { csrfRouter };
