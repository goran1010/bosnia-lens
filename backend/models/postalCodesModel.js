import prisma from "../db/prisma.js";

export function createMany(data) {
  return prisma.postalCode.createMany({
    data: data.map((name) => ({
      code: name.postalCode,
      city: name.city,
      post: name.post,
    })),
    skipDuplicates: true,
  });
}
