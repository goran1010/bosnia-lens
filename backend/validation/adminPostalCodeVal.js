import { param, validationResult } from "express-validator";

class AdminPostalCodeValidation {
  addContributor = [
    param("userId").trim().notEmpty().withMessage("User ID is required"),

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

  declineContributor = [
    param("userId").trim().notEmpty().withMessage("User ID is required"),

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

  removeContributor = [
    param("userId").trim().notEmpty().withMessage("User ID is required"),

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
