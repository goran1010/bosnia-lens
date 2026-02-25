import * as usersModel from "../models/usersModel.js";

function getContributors(req, res) {}

async function getRequestedContributors(req, res) {
  const requestedContributors = await usersModel.findRequestedContributors({
    isContributor: false,
    requestedContributor: true,
  });
  res.json(requestedContributors);
}

function addContributor(req, res) {}

function removeContributor(req, res) {}

export {
  getContributors,
  getRequestedContributors,
  addContributor,
  removeContributor,
};
