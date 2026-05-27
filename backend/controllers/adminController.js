import { transactionModel } from "../models/transactionModel.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { matchedData } from "express-validator";

class AdminController {
  // University admin handlers will be added in Phase 5
}

const adminController = new AdminController();

export { adminController };
