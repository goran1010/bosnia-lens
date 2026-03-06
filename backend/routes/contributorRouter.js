import { Router } from "express";
const contributorRouter = Router();

import { contributorController } from "../controllers/contributorController.js";
import * as contributorValidation from "../validation/contributorValidation.js";

contributorRouter.post(
  "/postal-codes",
  contributorValidation.createPostalCode,
  contributorController.createPostalCode,
);

contributorRouter.put(
  "/postal-codes",
  contributorValidation.editPostalCode,
  contributorController.editPostalCode,
);

contributorRouter.delete(
  "/postal-codes",
  contributorValidation.deletePostalCode,
  contributorController.deletePostalCode,
);

export { contributorRouter };
