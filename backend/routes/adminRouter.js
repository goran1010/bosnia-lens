import { Router } from "express";
const adminRouter = Router();

import { adminController } from "../controllers/adminController.js";
import { adminPostalCodeValidation } from "../validation/adminPostalCodeVal.js";

adminRouter.get("/contributors", adminController.getAllContributors);

adminRouter.get(
  "/requested-contributors",
  adminController.getRequestedContributors,
);

adminRouter.post(
  "/add-contributor/:userId",
  adminPostalCodeValidation.addContributor,
  adminController.addContributor,
);

adminRouter.post(
  "/decline-contributor/:userId",
  adminController.declineContributor,
);

adminRouter.delete(
  "/remove-contributor/:userId",
  adminController.removeContributor,
);

export { adminRouter };
