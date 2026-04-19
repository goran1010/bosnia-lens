import { Router } from "express";
const authRouter = Router();
import { authValidation } from "../validation/authValidation.js";
import { authController } from "../controllers/authController.js";
import { isNotAuthenticated } from "./auth/isNotAuthenticated.js";

authRouter.post(
  "/signup",
  authValidation.signupValidationRules,
  isNotAuthenticated,
  authController.signup,
);

authRouter.get(
  "/confirm/:token",
  authValidation.confirmTokenValidationRules,
  isNotAuthenticated,
  authController.confirmEmail,
);

authRouter.post(
  "/login",
  authValidation.loginValidationRules,
  isNotAuthenticated,
  authController.login,
);

authRouter.get("/github", authController.githubLogin);
authRouter.get("/github/callback", authController.githubCallback);

export { authRouter };
