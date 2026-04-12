import { query, validationResult } from "express-validator";
import { sendError } from "../utils/response.js";

class PostalCodeValidation {
  searchValidationRules = [
    query("searchTerm")
      .trim()
      .notEmpty()
      .withMessage("Search term is required")
      .custom((value) => {
        if (Number.isInteger(Number(value))) {
          if (value.length !== 5) {
            throw new Error("Postal codes must have 5 numbers");
          }
        } else {
          if (value.length < 2) {
            throw new Error("Search must have at least 2 characters");
          }
        }
        return true;
      }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendError(res, {
          status: 400,
          message: `Validation failed: ${errors
            .array()
            .map((entry) => `${entry.path}: ${entry.msg}`)
            .join(", ")}.`,
        });
      }
      next();
    },
  ];
}

const postalCodeValidation = new PostalCodeValidation();
export { postalCodeValidation };
