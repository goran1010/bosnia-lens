import axios from "axios";
import jwt from "jsonwebtoken";
import * as usersModel from "../models/usersModel.js";

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
    return res.redirect(`${process.env.URL}/login?error=no_code`);
  }

  try {
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

    if (!githubAccessToken) {
      return res.redirect(`${process.env.URL}/login?error=no_token`);
    }

    const userData = await axios.get(`https://api.github.com/user`, {
      headers: { Authorization: `Bearer ${githubAccessToken}` },
    });

    let { email, login } = userData.data;

    if (!email) {
      return res.redirect(`${process.env.URL}/login?error=no_email`);
    }

    let userExists = await usersModel.find({ email });

    if (userExists) {
      login = userExists.username;

      if (!userExists.isEmailConfirmed) {
        await usersModel.update(
          { email: userExists.email },
          { isEmailConfirmed: true },
        );
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
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // Send HTML page that will post message to parent window
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Success</title>
        </head>
        <body>
          <script>
            window.opener.postMessage({
              type: 'github-auth-success',
              data: ${JSON.stringify({
                accessToken,
                user: { email, username: login },
                message: `User ${login} logged in successfully`,
              })}
            }, '${process.env.URL}');
            window.close();
          </script>
        </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Error</title>
        </head>
        <body>
          <script>
            window.opener.postMessage({
              type: 'github-auth-error',
              error: ${JSON.stringify(error.message)}
            }, '${process.env.URL}');
            window.close();
          </script>
        </body>
      </html>
    `;
    res.status(500).send(errorHtml);
  }
}
