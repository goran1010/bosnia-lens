import { usersModel } from "../models/usersModel.js";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const NUMBER_OF_DAYS = 30;

class UsersController {
  logout(req, res) {
    req.logout((err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Couldn't log out", details: [{ msg: null }] });
      }

      req.session.destroy(() => {
        res.clearCookie("sessionId", {
          // Must set clearCookie options to match cookie set options, otherwise client will not clear cookie
          maxAge: NUMBER_OF_DAYS * 24 * 60 * 60 * 1000,
          sameSite: IS_PRODUCTION ? "none" : "lax",
          secure: IS_PRODUCTION,
          httpOnly: true,
          path: "/",
        });
        res.json({ message: "User logged out successfully" });
      });
    });
  }

  async becomeContributor(req, res) {
    const userId = req.user.id;

    const updatedUser = await usersModel.update(
      { id: userId },
      { requestedContributor: true },
    );

    if (!updatedUser) {
      return res.status(400).json({
        error: "Could not request contributor status",
        details: [{ msg: null }],
      });
    }

    res.json({
      message:
        "You've asked to become a contributor! An admin will review your request soon.",
      data: updatedUser,
    });
  }

  async me(req, res) {
    const loggedInUser = req.user;

    delete loggedInUser.password;

    res.json({ message: "User info retrieved", data: loggedInUser });
  }
}

const usersController = new UsersController();

export { usersController };
