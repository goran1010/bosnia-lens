import { Router } from "express";
const usersRouter = Router();
import * as usersController from "../controllers/usersController.js";

usersRouter.get("/me", usersController.me);

usersRouter.post("/become-contributor", usersController.becomeContributor);

usersRouter.post("/logout", usersController.logout);

export { usersRouter };
