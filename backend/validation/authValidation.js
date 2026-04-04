import { body, validationResult } from "express-validator";
import { usersModel } from "../models/usersModel.js";

class AuthValidation {
  signupValidationRules = [
    body("username")
      .trim()
      .isAlphanumeric()
      .withMessage("Username must be alphanumeric")
      .isLength({ min: 6 })
      .withMessage("Username must be at least 6 characters long")
      .custom(async (username) => {
        const user = await usersModel.find({ username });
        if (user) {
          throw new Error("Username already in use");
        }
        return true;
      }),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid email address")
      .custom(async (email) => {
        const user = await usersModel.find({ email });
        if (user) {
          throw new Error("Email already in use");
        }
        return true;
      }),

    body("password")
      .trim()
      .isAlphanumeric()
      .withMessage("Password must be alphanumeric")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

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
    body("token").trim().notEmpty().withMessage("Token is required"),
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
