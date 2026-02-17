import prisma from "../db/prisma.js";

export function createMany(postalCodesData) {
  return prisma.postalCode.createMany({
    data: postalCodesData.map((postalCode) => ({
      code: postalCode.postalCode,
      city: postalCode.city,
      post: postalCode.post,
    })),
    skipDuplicates: true,
  });
}

export function getAllPostalCodes() {
  return prisma.postalCode.findMany({ orderBy: { code: "asc" } });
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
    orderBy: { code: "asc" },
  });
}

export function createNew(city, code, post) {
  let capitalizedCity = city
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  code = Number(code);

  const allowedPosts = ["BH_POSTA", "POSTE_SRP", "HP_MOSTAR"];

  if (allowedPosts.includes(post)) {
    return prisma.postalCode.create({
      data: { city: capitalizedCity, code, post },
    });
  }
  return prisma.postalCode.create({
    data: { city: capitalizedCity, code },
  });
}
