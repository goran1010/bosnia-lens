import { param, validationResult } from "express-validator";

class AdminPostalCodeValidation {
  addContributor = [
    param("userId")
      .trim()
      .notEmpty()
      .withMessage("User ID is required")
      .isInt()
      .withMessage("User ID must be an integer"),

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
}

const adminPostalCodeValidation = new AdminPostalCodeValidation();
export { adminPostalCodeValidation };
