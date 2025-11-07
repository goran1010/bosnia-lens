import { Router } from "express";
const apiRouter = Router();
import apiController from "../controllers/apiController.js";

apiRouter.get("/", apiController);

export default apiRouter;
