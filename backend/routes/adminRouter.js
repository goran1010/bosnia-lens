import { Router } from "express";
const adminRouter = Router();

import * as adminController from "../controllers/adminController.js";

adminRouter.get("/contributors", adminController.getContributors);

adminRouter.get(
  "/requested-contributors",
  adminController.getRequestedContributors,
);

adminRouter.post("/add-contributor/:userId", adminController.addContributor);

adminRouter.post(
  "/decline-contributor/:userId",
  adminController.declineContributor,
);

adminRouter.delete(
  "/remove-contributor/:userId",
  adminController.removeContributor,
);

export { adminRouter };
