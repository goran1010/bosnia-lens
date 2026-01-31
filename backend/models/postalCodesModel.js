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

export function getAllPostalCodes() {
  return prisma.postalCode.findMany();
}

export function getPostalCodeByCode(code) {
  return prisma.postalCode.findUnique({
    where: { code },
  });
}

export function getPostalCodesByCity(city) {
  let capitalizedCity = city
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return prisma.postalCode.findMany({
    where: { city: capitalizedCity },
  });
}
