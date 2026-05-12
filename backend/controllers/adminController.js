import { pendingChangesPostalCodeModel } from "../models/pendingChangesPostalCodeModel.js";
import { transactionModel } from "../models/transactionModel.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { matchedData } from "express-validator";

class AdminController {
  async getPendingChanges(req, res) {
    const pendingChanges = await pendingChangesPostalCodeModel.findMany();

    return sendSuccess(res, {
      data: pendingChanges,
      message: "Pending changes retrieved successfully.",
    });
  }

  async declinePendingChange(req, res) {
    const { id } = matchedData(req);

    await pendingChangesPostalCodeModel.delete({ id });

    return sendSuccess(res, {
      message: "Pending change declined successfully.",
    });
  }

  async confirmPendingChange(req, res) {
    const { id, typeOfChange } = matchedData(req);
    const wasApplied = await transactionModel.approvePendingChange({
      id,
      typeOfChange,
    });

    if (!wasApplied) {
      return sendError(res, {
        status: 404,
        message: "Pending change not found.",
      });
    }

    return sendSuccess(res, {
      message: "Pending change approved successfully.",
    });
  }
}

const adminController = new AdminController();

export { adminController };
