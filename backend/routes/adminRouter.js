import { Router } from "express";
const adminRouter = Router();

import * as adminController from "../controllers/adminController.js";

adminRouter.get("/", adminController.getPostalCodes);

export { adminRouter };
