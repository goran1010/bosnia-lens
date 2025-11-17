import { Router } from "express";
const apiRouter = Router();
import * as apiController from "../controllers/apiController.js";

apiRouter.get("/status", apiController.status);

apiRouter.get("/postal-codes/:searchTerm", apiController.getPostalCodeByCode);
apiRouter.get("/postal-codes", apiController.getPostalCodes);

export default apiRouter;
