import { body, validationResult } from "express-validator";
import prisma from "../db/prisma.js";

export const signupValidationRules = [
  body("username")
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters long")
    .custom(async (username) => {
      const user = await prisma.user.findUnique({ where: { username } });
      if (user) {
        throw new Error("Username already in use");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const loginValidationRules = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("password").trim().notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
