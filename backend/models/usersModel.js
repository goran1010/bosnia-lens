import prisma from "../db/prisma.js";

export function find(where) {
  return prisma.user.findUnique({ where: { ...where } });
}

export function update(where, data) {
  return prisma.user.update({
    where: { ...where },
    data: { ...data },
  });
}

export function create(data) {
  return prisma.user.create({
    data: {
      ...data,
    },
  });
}
