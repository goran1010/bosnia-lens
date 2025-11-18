import { Router } from "express";
const usersRouter = Router();
import * as usersController from "../controllers/usersController.js";

usersRouter.post("/signup", usersController.signup);
usersRouter.post("/login", usersController.login);

export default usersRouter;
