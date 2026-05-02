import { prisma } from "../db/prisma.js";

class PendingChangesPostalCodeModel {
  async create(data) {
    return await prisma.pendingChangesPostalCode.create({
      data,
    });
  }

  async update(query, data) {
    return await prisma.pendingChangesPostalCode.updateMany({
      where: query,
      data,
    });
  }

  findMany(where) {
    if (!where) {
      return prisma.pendingChangesPostalCode.findMany();
    }
    return prisma.pendingChangesPostalCode.findMany({ where: { ...where } });
  }

  async delete(query) {
    return await prisma.pendingChangesPostalCode.deleteMany({
      where: query,
    });
  }
}

const pendingChangesPostalCodeModel = new PendingChangesPostalCodeModel();

export { pendingChangesPostalCodeModel };
