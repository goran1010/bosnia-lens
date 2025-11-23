import { Router } from "express";
const usersRouter = Router();
import * as usersController from "../controllers/usersController.js";
import * as validation from "../auth/validation.js";

usersRouter.post(
  "/signup",
  validation.signupValidationRules,
  usersController.signup,
);

usersRouter.get("/confirm/:token", usersController.confirmEmail);

usersRouter.post(
  "/login",
  validation.loginValidationRules,
  usersController.login,
);

usersRouter.post("/refresh-token", usersController.refreshToken);

usersRouter.post("/logout", usersController.logout);

export default usersRouter;
