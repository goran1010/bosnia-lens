import { matchedData } from "express-validator";
import { pendingChangesPostalCodeModel } from "../models/pendingChangesPostalCodeModel.js";
import { sendSuccess } from "../utils/response.js";
import { sanitizeUser, sanitizeUsers } from "../utils/sanitizeUser.js";

class AdminController {
  async getPendingChanges(req, res) {
    const pendingChanges = await pendingChangesPostalCodeModel.findMany();

    return sendSuccess(res, {
      data: pendingChanges,
      message: "Pending changes retrieved successfully.",
    });
  }
}

const adminController = new AdminController();

export { adminController };
