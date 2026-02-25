import * as usersModel from "../models/usersModel.js";

async function getAllContributors(req, res) {
  const contributors = await usersModel.findMany({
    isContributor: true,
  });
  res.json({
    message: "Contributors fetched successfully.",
    data: contributors,
  });
}

async function getRequestedContributors(req, res) {
  const requestedContributors = await usersModel.findMany({
    isContributor: false,
    requestedContributor: true,
  });
  res.json({
    message: "Requested contributors fetched successfully.",
    data: requestedContributors,
  });
}

async function addContributor(req, res) {
  const { userId } = req.params;
  await usersModel.create({ id: userId });
  res
    .status(201)
    .json({ message: "User promoted to contributor successfully." });
}

async function removeContributor(req, res) {
  const { userId } = req.params;
  await usersModel.update(
    { id: userId },
    { isContributor: false, requestedContributor: false },
  );
  res
    .status(201)
    .json({ message: "User removed from contributors successfully." });
}

async function declineContributor(req, res) {
  const { userId } = req.params;
  await usersModel.update({ id: userId }, { requestedContributor: false });
  res
    .status(201)
    .json({ message: "User's contributor request declined successfully." });
}

export {
  getAllContributors,
  getRequestedContributors,
  addContributor,
  removeContributor,
  declineContributor,
};
