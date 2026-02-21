import { prisma } from "../db/prisma.js";

function createMany(postalCodesData) {
  return prisma.postalCode.createMany({
    data: postalCodesData.map((postalCode) => ({
      code: postalCode.postalCode,
      city: postalCode.city,
      post: postalCode.post,
    })),
    skipDuplicates: true,
  });
}

function getAllPostalCodes() {
  return prisma.postalCode.findMany({ orderBy: { code: "asc" } });
}

function getPostalCodeByCode(code) {
  return prisma.postalCode.findUnique({
    where: { code },
  });
}

function getPostalCodesByCity(city) {
  let capitalizedCity = city
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return prisma.postalCode.findMany({
    where: { city: capitalizedCity },
    orderBy: { code: "asc" },
  });
}

function createNew(city, code, post) {
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

function edit(city, code, post) {
  let capitalizedCity = city
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  code = Number(code);

  const allowedPosts = ["BH_POSTA", "POSTE_SRP", "HP_MOSTAR"];

  if (allowedPosts.includes(post)) {
    return prisma.postalCode.update({
      where: { code },
      data: { city: capitalizedCity, post },
    });
  }
  return prisma.postalCode.update({
    where: { code },
    data: { city: capitalizedCity },
  });
}

function deleteCode(code) {
  code = Number(code);

  return prisma.postalCode.delete({ where: { code } });
}

export {
  deleteCode,
  edit,
  getAllPostalCodes,
  getPostalCodeByCode,
  getPostalCodesByCity,
  createMany,
  createNew,
};
