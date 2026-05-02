import { pendingChangesPostalCodeModel } from "../models/pendingChangesPostalCodeModel.js";
import { matchedData } from "express-validator";
import { sendSuccess } from "../utils/response.js";

class ContributionController {
  async createPostalCode(req, res) {
    const { city, code, post } = matchedData(req);

    const result = await pendingChangesPostalCodeModel.create({
      city,
      code,
      post,
    });

    return sendSuccess(res, {
      status: 201,
      message: "New postal code row created.",
      data: result,
    });
  }

  async editPostalCode(req, res) {
    const { city, code, post } = matchedData(req);

    const result = await pendingChangesPostalCodeModel.update(
      { city, code },
      { post },
    );

    return sendSuccess(res, {
      status: 201,
      message: "Postal code row edited.",
      data: result,
    });
  }

  async deletePostalCode(req, res) {
    const { code } = matchedData(req);

    const result = await pendingChangesPostalCodeModel.delete({ code });

    return sendSuccess(res, {
      message: "Postal code row deleted.",
      data: result,
    });
  }
}

const contributionController = new ContributionController();

export { contributionController };
