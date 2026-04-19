import { Router } from "express";
const authRouter = Router();
import { authValidation } from "../validation/authValidation.js";
import { authController } from "../controllers/authController.js";

authRouter.post(
  "/signup",
  authValidation.signupValidationRules,
  authController.signup,
);

authRouter.get(
  "/confirm/:token",
  authValidation.confirmTokenValidationRules,
  authController.confirmEmail,
);

authRouter.post(
  "/login",
  authValidation.loginValidationRules,
  authController.login,
);

authRouter.get("/github", authController.githubLogin);
authRouter.get("/github/callback", authController.githubCallback);

export { authRouter };
