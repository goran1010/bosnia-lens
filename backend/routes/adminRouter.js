import { Router } from "express";
const adminRouter = Router();

import { adminController } from "../controllers/adminController.js";
import { adminValidation } from "../validation/adminValidation.js";

adminRouter.get("/pending-changes", adminController.getPendingChanges);

export { adminRouter };
