import { Router } from "express";
const adminRouter = Router();

import * as adminController from "../controllers/adminController.js";

adminRouter.post("/postal-codes", adminController.createPostalCode);

adminRouter.delete("/postal-codes", adminController.deletePostalCode);

export { adminRouter };
