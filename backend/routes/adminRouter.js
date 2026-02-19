import { Router } from "express";
const adminRouter = Router();

import * as adminController from "../controllers/adminController.js";
import * as adminPostalCodeValidation from "../validation/adminPostalCodeVal.js";

adminRouter.post("/postal-codes", adminController.createPostalCode);

adminRouter.put("/postal-codes", adminController.editPostalCode);

adminRouter.delete(
  "/postal-codes",
  adminPostalCodeValidation.deletePostalCode,
  adminController.deletePostalCode,
);

export { adminRouter };
