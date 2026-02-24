import { Router } from "express";
const adminRouter = Router();

import * as adminController from "../controllers/adminController.js";

adminRouter.get("/contributors", adminController.getContributors);

adminRouter.get(
  "requested-contributors",
  adminController.getRequestedContributors,
);

adminRouter.post("/add-contributor", adminController.addContributor);

adminRouter.post("/remove-contributor", adminController.removeContributor);

export { adminRouter };
