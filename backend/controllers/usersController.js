import bcrypt from "bcryptjs";
import prisma from "../db/prisma.js";
import jwt from "jsonwebtoken";
import sendConfirmationEmail from "../email/confirmationEmail.js";
import emailConfirmHTML from "../utils/emailConfirmHTML.js";

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

    const confirmationToken = jwt.sign(
      { username, email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

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
          email,
          password: hashedPassword,
        },
      });

      if (!user) {
        return res.status(400).json({ error: "User could not be created" });
      }

      return res.status(201).json({
        message: "Registration successful! Check your email.",
      });
    }
    res.status(500).json({
      error: "Failed to send confirmation email",
      details: result.error,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function confirmEmail(req, res) {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { username: decoded.username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isEmailConfirmed) {
      return res.status(400).json({ error: "Email already confirmed" });
    }

    await prisma.user.update({
      where: { username: decoded.username },
      data: {
        isEmailConfirmed: true,
      },
    });

    res.send(emailConfirmHTML());
  } catch (err) {
    console.error(err);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  if (user.isEmailConfirmed === false) {
    return res.status(400).json({ error: "Email not confirmed" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  const accessToken = jwt.sign(
    { email: user.email, username: user.username },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30m",
    },
  );

  const refreshToken = jwt.sign(
    { email: user.email, username: user.username },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: `User ${username} logged in successfully`,
    data: {
      accessToken,
      user: { username: user.username, email: user.email },
    },
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
      { email: decodedToken.email, username: decodedToken.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" },
    );

    res.json({ data: { accessToken } });
  });
}
