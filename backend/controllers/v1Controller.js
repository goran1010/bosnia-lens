import { normalizeName } from "../utils/normalizeName.js";
import { postalCodesModel } from "../models/postalCodesModel.js";
import { matchedData } from "express-validator";

class V1Controller {
  status(req, res) {
    res.json({ message: "API v1 server is running" });
  }

  async getPostalCodes(req, res) {
    const postalCodes = await postalCodesModel.getAllPostalCodes();
    res.json({
      message: "Postal codes retrieved successfully",
      data: postalCodes,
    });
  }

  async getPostalCodeByCode(req, res) {
    let { searchTerm } = matchedData(req);

    const numericSearchTerm = Number(searchTerm);
    if (!Number.isNaN(numericSearchTerm) && numericSearchTerm > 0) {
      searchTerm = numericSearchTerm;
    } else {
      searchTerm = normalizeName(searchTerm);
    }

    let result = [];
    if (typeof searchTerm === "number") {
      const found = await postalCodesModel.getPostalCodeByCode(searchTerm);
      if (found) result.push(found);
    } else {
      result = await postalCodesModel.getPostalCodesByCity(searchTerm);
    }

    if (result.length > 0) {
      res.json({
        message: "Postal codes retrieved successfully",
        data: result,
      });
    } else {
      res
        .status(404)
        .json({ error: "Postal code not found", details: [{ msg: null }] });
    }
  }
}

const v1Controller = new V1Controller();

export { v1Controller };
