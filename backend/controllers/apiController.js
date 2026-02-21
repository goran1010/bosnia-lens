import normalizeName from "../utils/normalizeName.js";
import * as postalCodesModel from "../models/postalCodesModel.js";

export function status(req, res) {
  res.json({ message: "Server is running" });
}

export async function getPostalCodes(req, res) {
  const postalCodes = await postalCodesModel.getAllPostalCodes();
  res.json({
    message: "Postal codes retrieved successfully",
    data: postalCodes,
  });
}

export async function getPostalCodeByCode(req, res) {
  let { searchTerm } = req.query;

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
    res.json({ message: "Postal codes retrieved successfully", data: result });
  } else {
    res
      .status(404)
      .json({ error: "Postal code not found", details: [{ msg: null }] });
  }
}
