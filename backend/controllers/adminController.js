import { matchedData } from "express-validator";
import { usersModel } from "../models/usersModel.js";
import { sendSuccess } from "../utils/response.js";

class AdminController {
  async getAllContributors(req, res) {
    const contributors = await usersModel.findMany({
      role: "CONTRIBUTOR",
    });
    return sendSuccess(res, {
      message: "All contributors fetched successfully.",
      data: contributors,
    });
  }

  async getRequestedContributors(req, res) {
    const requestedContributors = await usersModel.findMany({
      requestedContributor: true,
    });
    return sendSuccess(res, {
      message: "Users requested contributor role fetched successfully.",
      data: requestedContributors,
    });
  }

  async addContributor(req, res) {
    const { userId } = matchedData(req);
    const updatedUser = await usersModel.update(
      { id: userId },
      { role: "CONTRIBUTOR", requestedContributor: false },
    );

    return sendSuccess(res, {
      status: 201,
      message: "User promoted to contributor successfully.",
      data: updatedUser,
    });
  }

  async removeContributor(req, res) {
    const { userId } = matchedData(req);
    const updatedUser = await usersModel.update(
      { id: userId },
      { role: "USER", requestedContributor: false },
    );

    return sendSuccess(res, {
      status: 201,
      message: "User removed from contributors successfully.",
      data: updatedUser,
    });
  }

  async declineContributor(req, res) {
    const { userId } = matchedData(req);
    const updatedUser = await usersModel.update(
      { id: userId },
      { requestedContributor: false },
    );

    return sendSuccess(res, {
      status: 201,
      message: "User's contributor request declined successfully.",
      data: updatedUser,
    });
  }
}

const adminController = new AdminController();

export { adminController };
