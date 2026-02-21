import { query, validationResult } from "express-validator";
import * as postalModel from "../models/postalCodesModel.js";

const validPosts = ["BH_POSTA", "POSTE_SRP", "HP_MOSTAR"];

export const createPostalCode = [
  query("code").trim().notEmpty().withMessage("Code is required"),
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
  query("code").custom(async (value) => {
    const codeExists = await postalModel.getPostalCodeByCode(Number(value));
    if (codeExists) {
      throw new Error("Code already exists");
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

export const editPostalCode = [
  query("code").trim().notEmpty().withMessage("Code is required"),
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

  query("code").custom(async (value) => {
    const codeExists = await postalModel.getPostalCodeByCode(Number(value));
    if (!codeExists) {
      throw new Error("Code doesn't exist");
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
