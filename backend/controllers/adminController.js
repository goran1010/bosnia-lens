import { matchedData } from "express-validator";
import { usersModel } from "../models/usersModel.js";
import { sendSuccess } from "../utils/response.js";
import { sanitizeUser, sanitizeUsers } from "../utils/sanitizeUser.js";

class AdminController {}

const adminController = new AdminController();

export { adminController };
