import { Router } from "express";
const usersRouter = Router();
import * as usersController from "../controllers/usersController.js";

usersRouter.post("/signup", usersController.signup);
usersRouter.post("/login", usersController.login);
usersRouter.post("/refresh-token", usersController.refreshToken);
usersRouter.post("/logout", usersController.logout);

export default usersRouter;
