import { usersModel } from "../models/usersModel.js";
import { sendError, sendSuccess } from "../utils/response.js";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const NUMBER_OF_DAYS = 30;

class UsersController {
  async me(req, res) {
    const loggedInUser = req.user;

    delete loggedInUser.password;

    return sendSuccess(res, {
      message: "User info retrieved",
      data: loggedInUser,
    });
  }

  async becomeContributor(req, res) {
    const { id, role } = req.user;

    if (role !== "USER") {
      return sendError(res, {
        status: 403,
        message:
          "Request denied: only regular users can request contributor access.",
      });
    }

    const updatedUser = await usersModel.update(
      { id },
      { requestedContributor: true },
    );

    if (!updatedUser) {
      return sendError(res, {
        status: 400,
        message:
          "Request failed: contributor request could not be saved. Try again.",
      });
    }

    return sendSuccess(res, {
      message:
        "You've asked to become a contributor! An admin will review your request soon.",
      data: updatedUser,
    });
  }

  logout(req, res) {
    req.logout((err) => {
      if (err) {
        console.error(err);
        return sendError(res, {
          status: 500,
          message: "Logout failed: try again.",
        });
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
        return sendSuccess(res, {
          message: "User logged out successfully",
          data: { success: true },
        });
      });
    });
  }
}

const usersController = new UsersController();

export { usersController };
