import { Router } from "express";
const adminRouter = Router();

import { adminController } from "../controllers/adminController.js";
import { adminValidation } from "../validation/adminValidation.js";

export { adminRouter };
