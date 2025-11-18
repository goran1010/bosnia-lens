import { Router } from "express";
const authRouter = Router();
import * as authController from "../controllers/authController.js";
import isAuthenticated from "../auth/isAuthenticated.js";

authRouter.get("/check-auth", isAuthenticated, authController.checkAuth);

export default authRouter;
