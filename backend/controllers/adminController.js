import * as usersModel from "../models/usersModel.js";

function getContributors(req, res) {}

async function getRequestedContributors(req, res) {
  const requestedContributors = await usersModel.findRequestedContributors({
    isContributor: false,
    requestedContributor: true,
  });
  res.json(requestedContributors);
}

async function addContributor(req, res) {
  const { userId } = req.params;
  await usersModel.addContributor({ id: userId });
  res.json({ message: "User promoted to contributor successfully." });
}

function removeContributor(req, res) {}

async function declineContributor(req, res) {
  const { userId } = req.params;
  await usersModel.declineContributor({ id: userId });
  res.json({ message: "User's contributor request declined successfully." });
}

export {
  getContributors,
  getRequestedContributors,
  addContributor,
  removeContributor,
  declineContributor,
};
