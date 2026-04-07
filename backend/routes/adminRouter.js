import { Router } from "express";
const adminRouter = Router();

import { adminController } from "../controllers/adminController.js";
import { adminValidation } from "../validation/adminValidation.js";

adminRouter.get("/contributors", adminController.getAllContributors);

adminRouter.get(
  "/requested-contributors",
  adminController.getRequestedContributors,
);

adminRouter.post(
  "/add-contributor",
  adminValidation.checkUserId,
  adminController.addContributor,
);

adminRouter.post(
  "/decline-contributor",
  adminValidation.checkUserId,
  adminController.declineContributor,
);

adminRouter.delete(
  "/remove-contributor",
  adminValidation.checkUserId,
  adminController.removeContributor,
);

export { adminRouter };
