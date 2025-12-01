import axios from "axios";
import prisma from "../db/prisma.js";

const gitHubClientId = process.env.CLIENT_ID;
const gitHubClientSecret = process.env.CLIENT_SECRET;

export function me(req, res) {
  res.json({ data: { accessToken: req.token } });
}

export async function githubLogin(req, res) {
  const params = {
    scope: "read:user",
    client_id: gitHubClientId,
  };

  const urlEncodedParams = new URLSearchParams(params).toString();
  res.redirect(`https://github.com/login/oauth/authorize?${urlEncodedParams}`);
}

export async function githubCallback(req, res) {
  const { code } = req.query;

  const body = {
    client_id: gitHubClientId,
    client_secret: gitHubClientSecret,
    code,
  };

  const options = { headers: { accept: "application/json" } };

  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    body,
    options,
  );

  const accessToken = response.data.access_token;

  const userData = await axios.get(`https://api.github.com/user`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const { email, login } = userData.data;

  let userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists && !userExists.isEmailConfirmed) {
    userExists = await prisma.user.update({
      where: { email: userExists.email },
      data: { isEmailConfirmed: true },
    });
  }

  res.status(201).json({
    data: { user: { email, username: login } },
    accessToken: "some-token",
  });
}
