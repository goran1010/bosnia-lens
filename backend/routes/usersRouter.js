import { Router } from "express";
const usersRouter = Router();
import * as usersController from "../controllers/usersController.js";
import * as userValidation from "../validation/userValidation.js";
import isNotAuthenticated from "../auth/isNotAuthenticated.js";
import isAuthenticated from "../auth/isAuthenticated.js";

usersRouter.post(
  "/signup",
  isNotAuthenticated,
  userValidation.signupValidationRules,
  usersController.signup,
);

usersRouter.post(
  "/login",
  isNotAuthenticated,
  userValidation.loginValidationRules,
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
