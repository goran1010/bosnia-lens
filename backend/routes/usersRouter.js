import { Router } from "express";
const usersRouter = Router();
import * as usersController from "../controllers/usersController.js";
import { adminRouter } from "./adminRouter.js";
import { isAdmin } from "../auth/isAdmin.js";
import { contributorRouter } from "./contributorRouter.js";
import { isContributor } from "../auth/isContributor.js";

usersRouter.get("/", usersController.user);

usersRouter.post("/become-contributor", usersController.becomeContributor);

usersRouter.post("/logout", usersController.logout);

usersRouter.use("/admin", isAdmin, adminRouter);

usersRouter.use("/contributor", isContributor, contributorRouter);

export { usersRouter };
