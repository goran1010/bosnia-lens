import { Router } from "express";
const authRouter = Router();
import * as authController from "../controllers/authController.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import axios from "axios";

authRouter.get("/me", isAuthenticated, authController.me);

authRouter.get("/", (req, res) => {
  const params = {
    scope: "read:user",
    client_id: process.env.CLIENT_ID,
  };

  const urlEncodedParams = new URLSearchParams(params).toString();
  res.redirect(`https://github.com/login/oauth/authorize?${urlEncodedParams}`);
});

authRouter.get("/github-callback", async (req, res) => {
  const { code } = req.query;

  const body = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code,
  };

  const options = { headers: { accept: "application/json" } };

  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    body,
    options,
  );

  const token = response.data.access_token;

  res.json(`token = ${token}`);
});

export default authRouter;
