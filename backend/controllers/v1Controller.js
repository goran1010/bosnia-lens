import { normalizeName } from "../utils/normalizeName.js";
import { postalCodesModel } from "../models/postalCodesModel.js";
import { matchedData } from "express-validator";
import { sendError, sendSuccess } from "../utils/response.js";

class V1Controller {
  status(req, res) {
    return sendSuccess(res, {
      data: {
        status: "ok",
      },
      message: "API v1 server is running",
    });
  }

  async getPostalCodes(req, res) {
    const postalCodes = await postalCodesModel.getAllPostalCodes();
    return sendSuccess(res, {
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
      return sendSuccess(res, {
        message: "Postal codes retrieved successfully",
        data: result,
      });
    }

    return sendError(res, {
      status: 404,
      message: "Postal code not found: verify the search term and try again.",
    });
  }
}

const v1Controller = new V1Controller();

export { v1Controller };
