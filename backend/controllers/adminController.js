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

  async declinePendingChange(req, res) {
    const { id } = req.body;

    await pendingChangesPostalCodeModel.delete({ id });

    return sendSuccess(res, {
      message: "Pending change declined successfully.",
    });
  }
}

const adminController = new AdminController();

export { adminController };
