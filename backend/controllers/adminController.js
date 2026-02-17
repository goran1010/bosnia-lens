import * as getPostalCodesModel from "../models/postalCodesModel.js";

async function getPostalCodes(req, res) {
  const { city, code, post } = req.query;

  const create = await getPostalCodesModel.createNew(city, code, post);
  res.json({ create });
}

export { getPostalCodes };
