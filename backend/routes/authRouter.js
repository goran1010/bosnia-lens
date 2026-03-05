import { Router } from "express";
const authRouter = Router();
import * as userValidation from "../validation/userValidation.js";
import { authController } from "../controllers/authController.js";

authRouter.post(
  "/signup",
  userValidation.signupValidationRules,
  authController.signup,
);

authRouter.get("/confirm/:token", authController.confirmEmail);

authRouter.post(
  "/login",
  userValidation.loginValidationRules,
  authController.login,
);

export { authRouter };
