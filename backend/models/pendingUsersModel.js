import { prisma } from "../db/prisma.js";

class PendingUserModel {
  async create(data) {
    return await prisma.pendingUser.create({
      data,
    });
  }

  async update(query, data) {
    return await prisma.pendingUser.updateMany({
      where: query,
      data,
    });
  }

  async findOne(query) {
    return await prisma.pendingUser.findFirst({
      where: query,
    });
  }

  async delete(query) {
    return await prisma.pendingUser.deleteMany({
      where: query,
    });
  }
}

const pendingUserModel = new PendingUserModel();

export { pendingUserModel };
