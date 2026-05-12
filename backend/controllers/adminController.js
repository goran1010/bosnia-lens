import { pendingChangesPostalCodeModel } from "../models/pendingChangesPostalCodeModel.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { matchedData } from "express-validator";
import { prisma } from "../db/prisma.js";

class AdminController {
  async getPendingChanges(req, res) {
    const pendingChanges = await pendingChangesPostalCodeModel.findMany();

    return sendSuccess(res, {
      data: pendingChanges,
      message: "Pending changes retrieved successfully.",
    });
  }

  async declinePendingChange(req, res) {
    const { id } = matchedData(req);

    await pendingChangesPostalCodeModel.delete({ id });

    return sendSuccess(res, {
      message: "Pending change declined successfully.",
    });
  }

  async confirmPendingChange(req, res) {
    const { id, typeOfChange } = matchedData(req);

    const wasApplied = await prisma.$transaction(async (tx) => {
      const change = await tx.pendingChangesPostalCode.findUnique({
        where: { id },
      });

      if (!change) {
        return false;
      }

      if (typeOfChange === "CREATE") {
        await tx.postalCode.create({
          data: {
            city: change.city,
            code: change.code,
            post: change.post,
          },
        });
      } else if (typeOfChange === "UPDATE") {
        await tx.postalCode.updateMany({
          where: { code: change.code },
          data: {
            city: change.city,
            post: change.post,
          },
        });
      } else if (typeOfChange === "DELETE") {
        await tx.postalCode.deleteMany({
          where: { code: change.code },
        });
      }

      await tx.pendingChangesPostalCode.delete({
        where: { id: change.id },
      });

      return true;
    });

    if (!wasApplied) {
      return sendError(res, {
        status: 404,
        message: "Pending change not found.",
      });
    }

    return sendSuccess(res, {
      message: "Pending change approved successfully.",
    });
  }
}

const adminController = new AdminController();

export { adminController };
