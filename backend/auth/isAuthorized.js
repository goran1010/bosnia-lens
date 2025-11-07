import isAuthenticated from "./isAuthenticated.js";
import * as usersModel from "../models/usersModel.js";

const isAuthorized = [
  isAuthenticated,
  async (req, res, next) => {
    const { userId } = req;
    const user = await usersModel.getUserById(userId);
    if (user.isAuthor) {
      next();
    } else {
      res
        .status(403)
        .json({
          errors: [{ msg: "You don't have the required authorization" }],
        });
    }
  },
];

export default isAuthorized;
