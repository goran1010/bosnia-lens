import { body, validationResult } from "express-validator";

export const postalCodeSearchValidationRules = [
  body("searchTerm").trim().notEmpty().withMessage("Search term is required"),
  body("searchTerm").custom((value) => {
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
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }
    next();
  },
];
