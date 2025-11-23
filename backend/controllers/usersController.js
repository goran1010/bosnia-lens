import bcrypt from "bcryptjs";
import prisma from "../db/prisma.js";
import jwt from "jsonwebtoken";
import sendConfirmationEmail from "../email/confirmationEmail.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "Missing required environment variables: ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET",
  );
}

export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const userExists = await prisma.user.findUnique({
      where: { username },
    });

    if (userExists) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const confirmationToken = Math.random().toString(36).substring(7);
    const confirmationLink = `${req.protocol}://${req.get("host")}/users/confirm/${confirmationToken}`;

    const result = await sendConfirmationEmail(
      email,
      username,
      confirmationLink,
    );

    if (result.success) {
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      if (!user) {
        return res.status(400).json({ error: "User could not be created" });
      }

      res.json({
        message: "Registration successful! Check your email.",
        emailSent: true,
      });
    } else {
      res.status(500).json({
        message: "Failed to send confirmation email.",
        error: result.error,
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function confirmEmail(req, res) {
  const { token } = req.params;
  console.log("Confirming token:", token);
  res.send(
    "<h1>Email Confirmed!</h1><main><p>Your account has been activated.</p><a href=/login>Log in</a></main>",
  );
}

export async function login(req, res) {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "2m",
    },
  );

  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: `User ${username} logged in successfully`,
    accessToken,
    user,
  });
}

export function logout(req, res) {
  res.clearCookie("refreshToken");
  res.json({ message: "User logged out successfully" });
}

export function refreshToken(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { id: decodedToken.id, username: decodedToken.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" },
    );

    res.json({ accessToken });
  });
}
