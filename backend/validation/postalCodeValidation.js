import { query } from "express-validator";
import { validationError } from "./validationError.js";

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
    validationError,
  ];
}

const postalCodeValidation = new PostalCodeValidation();
export { postalCodeValidation };
