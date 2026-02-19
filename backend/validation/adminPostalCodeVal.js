import { query, validationResult } from "express-validator";
const validPosts = ["BH_POSTA", "POSTE_SRP", "HP_MOSTAR"];

export const editPostalCode = [
  query("code").trim().notEmpty().withMessage("Search term is required"),
  query("code").custom((value) => {
    if (Number.isInteger(Number(value))) {
      if (value.length !== 5) {
        throw new Error("Postal codes must have 5 numbers");
      }
    } else {
      throw new Error("Must be a number");
    }
    return true;
  }),

  query("city").trim().notEmpty().withMessage("City is required"),

  query("post").custom((value) => {
    if (!validPosts.includes(value) && value !== "") {
      throw new Error("Invalid post");
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

export const deletePostalCode = [
  query("code").trim().notEmpty().withMessage("Search term is required"),
  query("code").custom((value) => {
    if (Number.isInteger(Number(value))) {
      if (value.length !== 5) {
        throw new Error("Postal codes must have 5 numbers");
      }
    } else {
      throw new Error("Must be a number");
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
