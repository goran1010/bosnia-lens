import { postalCodesModel } from "../models/postalCodesModel.js";
import { matchedData } from "express-validator";

class ContributorController {
  async createPostalCode(req, res) {
    const { city, code, post } = matchedData(req);

    const result = await postalCodesModel.createNew(city, code, post);
    res
      .status(201)
      .json({ message: "New postal code row created.", data: result });
  }

  async editPostalCode(req, res) {
    const { city, code, post } = matchedData(req);

    const result = await postalCodesModel.edit(city, code, post);
    res.status(201).json({ message: "Postal code row edited.", data: result });
  }

  async deletePostalCode(req, res) {
    const { code } = matchedData(req);

    const result = await postalCodesModel.deleteCode(code);
    res.json({ message: "Postal code row deleted.", data: result });
  }
}

const contributorController = new ContributorController();

export { contributorController };
