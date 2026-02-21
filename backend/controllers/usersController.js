import bcrypt from "bcryptjs";
import * as usersModel from "../models/usersModel.js";
import jwt from "jsonwebtoken";
import { sendConfirmationEmail } from "../email/confirmationEmail.js";
import { emailConfirmHTML } from "../utils/emailConfirmHTML.js";
import { passport } from "../config/passport.js";

const NUMBER_OF_DAYS = 30;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const userExists = await usersModel.find({ username });

    if (userExists) {
      return res.status(400).json({
        error: "Username already taken",
        details: [{ msg: "Username already taken" }],
      });
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
      const user = await usersModel.create({
        username,
        email,
        password: hashedPassword,
      });

      if (!user) {
        return res.status(400).json({
          error: "User could not be created",
          details: [{ msg: null }],
        });
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
    res
      .status(500)
      .json({ error: "Couldn't sign up", details: [{ msg: null }] });
  }
}

async function confirmEmail(req, res) {
  const { token } = req.params;

  if (!token) {
    return res
      .status(400)
      .json({ error: "No token provided", details: [{ msg: null }] });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const user = await usersModel.find({ username: decoded.username });

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found", details: [{ msg: null }] });
    }

    if (user.isEmailConfirmed) {
      return res
        .status(400)
        .json({ error: "Email already confirmed", details: [{ msg: null }] });
    }

    await usersModel.update(
      { username: decoded.username },
      { isEmailConfirmed: true },
    );

    res.send(emailConfirmHTML());
  } catch (err) {
    console.error(err);

    res
      .status(500)
      .json({ error: "Couldn't confirm email", details: [{ msg: null }] });
  }
}

async function login(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({
        error: "Login unsuccessful",
        details: [{ msg: info.message }],
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({
        message: "Logged in successfully",
        data: user,
      });
    });
  })(req, res, next);
}

function logout(req, res) {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Couldn't log out", details: [{ msg: null }] });
    }

    req.session.destroy(() => {
      res.clearCookie("connect.sid", {
        // Must set clearCookie options to match cookie set options, otherwise client will not clear cookie
        maxAge: NUMBER_OF_DAYS * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
        httpOnly: true,
        path: "/",
      });
      res.json({ message: "User logged out successfully" });
    });
  });
}

export { signup, confirmEmail, login, logout };
