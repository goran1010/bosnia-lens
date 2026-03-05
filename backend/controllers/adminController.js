import { usersModel } from "../models/usersModel.js";

class AdminController {
  async getAllContributors(req, res) {
    const contributors = await usersModel.findMany({
      isContributor: true,
    });
    res.json({
      message: "Contributors fetched successfully.",
      data: contributors,
    });
  }

  async getRequestedContributors(req, res) {
    const requestedContributors = await usersModel.findMany({
      isContributor: false,
      requestedContributor: true,
    });
    res.json({
      message: "Requested contributors fetched successfully.",
      data: requestedContributors,
    });
  }

  async addContributor(req, res) {
    const { userId } = req.params;
    await usersModel.update(
      { id: userId },
      { isContributor: true, requestedContributor: false },
    );
    res
      .status(201)
      .json({ message: "User promoted to contributor successfully." });
  }

  async removeContributor(req, res) {
    const { userId } = req.params;
    await usersModel.update(
      { id: userId },
      { isContributor: false, requestedContributor: false },
    );
    res
      .status(201)
      .json({ message: "User removed from contributors successfully." });
  }

  async declineContributor(req, res) {
    const { userId } = req.params;
    await usersModel.update({ id: userId }, { requestedContributor: false });
    res
      .status(201)
      .json({ message: "User's contributor request declined successfully." });
  }
}

const adminController = new AdminController();

export { adminController };
