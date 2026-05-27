import { body } from "express-validator";
import { validationError } from "./validationError.js";

class ContributionValidation {
  deletePendingChange = [
    body("id")
      .trim()
      .notEmpty()
      .withMessage("Pending change ID is required")
      .bail()
      .isUUID()
      .withMessage("Pending change ID must be a valid UUID"),

    validationError,
  ];

  // University contribution validation will be added in Phase 4
}

const contributionValidation = new ContributionValidation();
export { contributionValidation };
