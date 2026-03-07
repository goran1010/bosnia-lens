import { Router } from "express";
const v1Router = Router();

import { v1Controller } from "../controllers/v1Controller.js";
import { postalCodeSearchValidationRules } from "../validation/postalCodeValidation.js";

v1Router.get("/", v1Controller.status);

v1Router.get(
  "/postal-codes/search",
  postalCodeSearchValidationRules,
  v1Controller.getPostalCodeByCode,
);
v1Router.get("/postal-codes", v1Controller.getPostalCodes);

export { v1Router };
