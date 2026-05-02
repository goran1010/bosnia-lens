import { Router } from "express";
const contributionRouter = Router();

import { contributionController } from "../controllers/contributionController.js";
import { contributionValidation } from "../validation/contributionValidation.js";

contributionRouter.post(
  "/postal-codes",
  contributionValidation.createPostalCode,
  contributionController.createPostalCode,
);

contributionRouter.put(
  "/postal-codes",
  contributionValidation.editPostalCode,
  contributionController.editPostalCode,
);

contributionRouter.delete(
  "/postal-codes",
  contributionValidation.deletePostalCode,
  contributionController.deletePostalCode,
);

export { contributionRouter };
