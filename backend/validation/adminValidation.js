import { body } from "express-validator";
import { validationError } from "./validationError.js";

class AdminValidation {
  checkUserId = [
    body("userId").trim().notEmpty().withMessage("User ID is required"),

    validationError,
  ];
}

const adminValidation = new AdminValidation();
export { adminValidation };
