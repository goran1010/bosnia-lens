import { body, validationResult } from "express-validator";

class AdminValidation {
  checkUserId = [
    body("userId").trim().notEmpty().withMessage("User ID is required"),

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

const adminValidation = new AdminValidation();
export { adminValidation };
