import { query, validationResult } from "express-validator";
import { postalCodesModel } from "../models/postalCodesModel.js";
import { sendError } from "../utils/response.js";

const validPosts = ["BH_POSTA", "POSTE_SRP", "HP_MOSTAR"];

class ContributorValidation {
  createPostalCode = [
    query("code")
      .trim()
      .notEmpty()
      .withMessage("Code is required")
      .custom((value) => {
        if (Number.isInteger(Number(value))) {
          if (value.length !== 5) {
            throw new Error("Postal codes must have 5 numbers");
          }
        } else {
          throw new Error("Must be a number");
        }
        return true;
      })
      .custom(async (value) => {
        const codeExists = await postalCodesModel.getPostalCodeByCode(
          Number(value),
        );
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
        return sendError(res, {
          status: 400,
          message: `Validation failed: ${errors
            .array()
            .map((entry) => entry.msg)
            .join(" ")} Fix the highlighted fields and try again.`,
        });
      }
      next();
    },
  ];

  editPostalCode = [
    query("code")
      .trim()
      .notEmpty()
      .withMessage("Code is required")
      .custom(async (value) => {
        const codeExists = await postalCodesModel.getPostalCodeByCode(
          Number(value),
        );
        if (!codeExists) {
          throw new Error("Code doesn't exist");
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
        return sendError(res, {
          status: 400,
          message: `Validation failed: ${errors
            .array()
            .map((entry) => entry.msg)
            .join(" ")} Fix the highlighted fields and try again.`,
        });
      }
      next();
    },
  ];

  deletePostalCode = [
    query("code")
      .trim()
      .notEmpty()
      .withMessage("Can't delete data. Code is required")
      .custom(async (value) => {
        const codeExists = await postalCodesModel.getPostalCodeByCode(
          Number(value),
        );
        if (!codeExists) {
          throw new Error("Code doesn't exist");
        }
        return true;
      }),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendError(res, {
          status: 400,
          message: `Validation failed: ${errors
            .array()
            .map((entry) => entry.msg)
            .join(" ")} Fix the highlighted fields and try again.`,
        });
      }
      next();
    },
  ];
}

const contributorValidation = new ContributorValidation();
export { contributorValidation };
