import { sendError } from "../utils/response.js";

function isContributor(req, res, next) {
  try {
    if (!req.user) {
      return sendError(res, {
        status: 401,
        message:
          "Access denied: log in with a contributor or admin account.",
      });
    }

    if (req.user.role === "CONTRIBUTOR" || req.user.role === "ADMIN")
      return next();

    return sendError(res, {
      status: 403,
      message: "Access denied: contributor role is required.",
    });
  } catch (err) {
    next(err);
  }
}

export { isContributor };
