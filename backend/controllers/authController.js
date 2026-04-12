import { usersModel } from "../models/usersModel.js";
import jwt from "jsonwebtoken";
import { emailConfirmHTML } from "../utils/emailConfirmHTML.js";
import { passport } from "../config/passport.js";
import { sendConfirmationEmail } from "../email/confirmationEmail.js";
import bcrypt from "bcryptjs";
import { matchedData } from "express-validator";
import { sendError, sendSuccess } from "../utils/response.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const BACKEND_URL = process.env.BACKEND_URL;

class AuthController {
  async signup(req, res) {
    try {
      const { username, email, password } = matchedData(req);
      const hashedPassword = await bcrypt.hash(password, 10);

      const confirmationToken = jwt.sign(
        { username, email },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" },
      );

      const confirmationLink = `${BACKEND_URL}/auth/confirm/${confirmationToken}`;

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
          return sendError(res, {
            status: 400,
            message: "Signup failed: account could not be created. Try again.",
          });
        }

        return sendSuccess(res, {
          status: 201,
          data: sanitizeUser(user),
          message: "Registration successful! Check your email.",
        });
      }

      return sendError(res, {
        status: 500,
        message:
          "Signup failed: confirmation email was not sent. Check your email address and try again.",
      });
    } catch (err) {
      console.error(err);

      return sendError(res, {
        status: 400,
        message: "Signup failed: check your input and try again.",
      });
    }
  }

  async confirmEmail(req, res) {
    const { token } = matchedData(req);

    if (!token) {
      return sendError(res, {
        status: 400,
        message: "Email confirmation failed: token is missing.",
      });
    }

    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

      const user = await usersModel.findOne({ username: decoded.username });

      if (!user) {
        return sendError(res, {
          status: 404,
          message: "Email confirmation failed: account was not found.",
        });
      }

      if (user.isEmailConfirmed) {
        return sendError(res, {
          status: 400,
          message: "Email already confirmed: log in to continue.",
        });
      }

      await usersModel.update(
        { username: decoded.username },
        { isEmailConfirmed: true },
      );

      res.send(emailConfirmHTML());
    } catch (err) {
      console.error(err);

      return sendError(res, {
        status: 500,
        message:
          "Email confirmation failed: token is invalid or expired. Request a new confirmation email.",
      });
    }
  }

  async login(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        const loginReason = info?.message || "Invalid username or password";
        return sendError(res, {
          status: 401,
          message: `Login failed: ${loginReason}. Check your credentials and try again.`,
        });
      }

      req.logIn(user, (err) => {
        if (err) return next(err);

        return sendSuccess(res, {
          message: "Logged in successfully",
          data: sanitizeUser(user),
        });
      });
    })(req, res, next);
  }
}

const authController = new AuthController();

export { authController };
