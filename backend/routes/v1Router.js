import { Router } from "express";
const v1Router = Router();

import { v1Controller } from "../controllers/v1Controller.js";

v1Router.get("/", v1Controller.status);

export { v1Router };
