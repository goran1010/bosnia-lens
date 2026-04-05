import { body, validationResult, param } from "express-validator";
import { usersModel } from "../models/usersModel.js";

class AuthValidation {
  signupValidationRules = [
    body("username")
      .trim()
      .custom((value) => {
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          throw new Error(
            "Username can only contain letters, numbers, dashes or underscores",
          );
        }
        return true;
      })
      .isLength({ min: 6 })
      .withMessage("Username must be at least 6 characters long")
      .custom(async (username) => {
        const user = await usersModel.findOne({ username });
        if (user) {
          throw new Error("Username already in use");
        }
        return true;
      }),

    body("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email address")
      .custom(async (email) => {
        const user = await usersModel.findOne({ email });
        if (user) {
          throw new Error("Email already in use");
        }
        return true;
      }),

    body("password")
      .trim()
      .custom((value) => {
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          throw new Error(
            "Password can only contain letters, numbers, dashes or underscores",
          );
        }
        return true;
      })
      .isStrongPassword({
        minLength: 6,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
      })
      .withMessage(
        "Password must be at least 6 characters long and contain at least one number",
      ),

    body("confirm-password")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
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

  confirmTokenValidationRules = [
    param("token").trim().notEmpty().withMessage("Token is required"),
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

  loginValidationRules = [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").trim().notEmpty().withMessage("Password is required"),
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

const authValidation = new AuthValidation();

export { authValidation };
