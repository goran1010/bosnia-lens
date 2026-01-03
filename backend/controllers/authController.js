import axios from "axios";
import prisma from "../db/prisma.js";
import jwt from "jsonwebtoken";

const gitHubClientId = process.env.CLIENT_ID;
const gitHubClientSecret = process.env.CLIENT_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export function me(req, res) {
  res.json({ message: "User is authenticated" });
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

  if (!code) {
    return res.status(400).json({ error: "Code not provided" });
  }

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

  const githubAccessToken = response.data.access_token;

  const userData = await axios.get(`https://api.github.com/user`, {
    headers: { Authorization: `Bearer ${githubAccessToken}` },
  });

  let { email, login } = userData.data;

  let userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) {
    login = userExists.username;

    if (!userExists.isEmailConfirmed) {
      await prisma.user.update({
        where: { email: userExists.email },
        data: { isEmailConfirmed: true },
      });
    }
  }

  const accessToken = jwt.sign(
    { email, username: login },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30m",
    },
  );

  const refreshToken = jwt.sign(
    { email, username: login },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: `User ${login} logged in successfully`,
    data: {
      accessToken,
      user: { email, username: login },
    },
  });
}
