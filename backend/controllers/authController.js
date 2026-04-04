import { usersModel } from "../models/usersModel.js";
import jwt from "jsonwebtoken";
import { emailConfirmHTML } from "../utils/emailConfirmHTML.js";
import { passport } from "../config/passport.js";
import { sendConfirmationEmail } from "../email/confirmationEmail.js";
import bcrypt from "bcryptjs";
import { matchedData } from "express-validator";

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
        .status(400)
        .json({ error: "Couldn't sign up", details: [{ msg: null }] });
    }
  }

  async confirmEmail(req, res) {
    const { token } = matchedData(req);

    if (!token) {
      return res
        .status(400)
        .json({ error: "No token provided", details: [{ msg: null }] });
    }

    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

      const user = await usersModel.findOne({ username: decoded.username });

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

  async login(req, res, next) {
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
        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return res.json({
          message: "Logged in successfully",
          data: userWithoutPassword,
        });
      });
    })(req, res, next);
  }
}

const authController = new AuthController();

export { authController };
