import { Router } from "express";
const contributionRouter = Router();

import { contributionController } from "../controllers/contributionController.js";
import { contributionValidation } from "../validation/contributionValidation.js";

// University contribution routes will be added in Phase 5

export { contributionRouter };
