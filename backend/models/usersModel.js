import { prisma } from "../db/prisma.js";

function find(where) {
  return prisma.user.findUnique({ where: { ...where } });
}

function update(where, data) {
  return prisma.user.update({
    where: { ...where },
    data: { ...data },
  });
}

function create(data) {
  return prisma.user.create({
    data: {
      ...data,
    },
  });
}

function deleteAll() {
  return prisma.user.deleteMany();
}

export { find, update, create, deleteAll };
