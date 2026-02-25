import * as usersModel from "../models/usersModel.js";

async function getAllContributors(req, res) {
  const contributors = await usersModel.findAllContributors({
    isContributor: true,
  });
  res.json({
    message: "Contributors fetched successfully.",
    data: contributors,
  });
}

async function getRequestedContributors(req, res) {
  const requestedContributors = await usersModel.findRequestedContributors({
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
  await usersModel.addContributor({ id: userId });
  res
    .status(201)
    .json({ message: "User promoted to contributor successfully." });
}

function removeContributor(req, res) {}

async function declineContributor(req, res) {
  const { userId } = req.params;
  await usersModel.declineContributor({ id: userId });
  res
    .status(200)
    .json({ message: "User's contributor request declined successfully." });
}

export {
  getAllContributors,
  getRequestedContributors,
  addContributor,
  removeContributor,
  declineContributor,
};
