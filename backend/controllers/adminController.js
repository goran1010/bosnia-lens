import * as getPostalCodesModel from "../models/postalCodesModel.js";

async function createPostalCode(req, res) {
  const { city, code, post } = req.query;

  const result = await getPostalCodesModel.createNew(city, code, post);
  res.json({ message: "New postal code row created.", data: result });
}

async function editPostalCode(req, res) {
  const { city, code, post } = req.query;

  const result = await getPostalCodesModel.edit(city, code, post);
  res.json({ message: "Postal code row edited.", data: result });
}

async function deletePostalCode(req, res) {
  const { code } = req.query;

  await getPostalCodesModel.deleteCode(code);
  res.json({ message: "Postal code row deleted." });
}

export { createPostalCode, deletePostalCode, editPostalCode };
