import { Router } from "express";
const authRouter = Router();
import * as authController from "../controllers/authController.js";
import isAuthenticated from "../auth/isAuthenticated.js";

authRouter.get("/me", isAuthenticated, authController.me);

authRouter.get("/", authController.githubLogin);

authRouter.get("/github-callback", authController.githubCallback);

export default authRouter;
