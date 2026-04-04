import { Router } from "express";
const authRouter = Router();
import * as authValidation from "../validation/authValidation.js";
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

export { authRouter };
