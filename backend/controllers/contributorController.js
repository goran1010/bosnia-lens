import { postalCodesModel } from "../models/postalCodesModel.js";
import { matchedData } from "express-validator";
import { sendSuccess } from "../utils/response.js";

class ContributorController {
  async createPostalCode(req, res) {
    const { city, code, post } = matchedData(req);

    const result = await postalCodesModel.createNew(city, code, post);

    return sendSuccess(res, {
      status: 201,
      message: "New postal code row created.",
      data: result,
    });
  }

  async editPostalCode(req, res) {
    const { city, code, post } = matchedData(req);

    const result = await postalCodesModel.edit(city, code, post);

    return sendSuccess(res, {
      status: 201,
      message: "Postal code row edited.",
      data: result,
    });
  }

  async deletePostalCode(req, res) {
    const { code } = matchedData(req);

    const result = await postalCodesModel.deleteCode(code);

    return sendSuccess(res, {
      message: "Postal code row deleted.",
      data: result,
    });
  }
}

const contributorController = new ContributorController();

export { contributorController };
