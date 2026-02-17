import { Router } from "express";
const adminRouter = Router();

import * as adminController from "../controllers/adminController.js";

adminRouter.post("/postal-codes", adminController.getPostalCodes);

export { adminRouter };
