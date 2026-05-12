import { prisma } from "../db/prisma.js";

class TransactionModel {
  async approvePendingChange({ id, typeOfChange }) {
    return prisma.$transaction(async (tx) => {
      const pendingChange = await tx.pendingChangesPostalCode.findUnique({
        where: { id },
      });

      if (!pendingChange) {
        return false;
      }

      if (typeOfChange === "CREATE") {
        await tx.postalCode.create({
          data: {
            city: pendingChange.city,
            code: pendingChange.code,
            post: pendingChange.post,
          },
        });
      } else if (typeOfChange === "UPDATE") {
        await tx.postalCode.updateMany({
          where: { code: pendingChange.code },
          data: {
            city: pendingChange.city,
            post: pendingChange.post,
          },
        });
      } else if (typeOfChange === "DELETE") {
        await tx.postalCode.deleteMany({
          where: { code: pendingChange.code },
        });
      }

      await tx.pendingChangesPostalCode.delete({
        where: { id: pendingChange.id },
      });

      return true;
    });
  }
}

const transactionModel = new TransactionModel();

export { transactionModel };
