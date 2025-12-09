import { Router } from "express";
const usersRouter = Router();
import * as usersController from "../controllers/usersController.js";
import * as validation from "../auth/validation.js";
import isNotAuthenticated from "../auth/isNotAuthenticated.js";
import isAuthenticated from "../auth/isAuthenticated.js";

usersRouter.post(
  "/signup",
  isNotAuthenticated,
  validation.signupValidationRules,
  usersController.signup,
);

usersRouter.post(
  "/login",
  isNotAuthenticated,
  validation.loginValidationRules,
  usersController.login,
);

usersRouter.get(
  "/refresh-token",
  isNotAuthenticated,
  usersController.refreshToken,
);
usersRouter.get(
  "/confirm/:token",
  isNotAuthenticated,
  usersController.confirmEmail,
);

usersRouter.post("/logout", isAuthenticated, usersController.logout);

export default usersRouter;
