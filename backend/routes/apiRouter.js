import { Router } from "express";
const apiRouter = Router();
import * as apiController from "../controllers/apiController.js";
import { postalCodeSearchValidationRules } from "../validation/postalCodeValidation.js";

apiRouter.get("/status", apiController.status);

apiRouter.get(
  "/postal-codes/:searchTerm",
  postalCodeSearchValidationRules,
  apiController.getPostalCodeByCode,
);
apiRouter.get("/postal-codes", apiController.getPostalCodes);

export default apiRouter;
