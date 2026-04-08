import { prisma } from "../db/prisma.js";

class PostalCodesModel {
  createMany(postalCodesData) {
    return prisma.postalCode.createMany({
      data: postalCodesData.map((postalCode) => ({
        code: postalCode.postalCode,
        city: postalCode.city,
        post: postalCode.post,
      })),
      skipDuplicates: true,
    });
  }

  getAllPostalCodes() {
    return prisma.postalCode.findMany({ orderBy: { code: "asc" } });
  }

  getPostalCodeByCode(code) {
    return prisma.postalCode.findUnique({
      where: { code },
    });
  }

  getPostalCodesByCity(city) {
    let capitalizedCity = city
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return prisma.postalCode.findMany({
      where: { city: capitalizedCity },
      orderBy: { code: "asc" },
    });
  }

  createNew(city, code, post) {
    let capitalizedCity = city
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    let codeNumber = Number(code);

    const allowedPosts = ["BH_POSTA", "POSTE_SRP", "HP_MOSTAR"];

    if (allowedPosts.includes(post)) {
      return prisma.postalCode.create({
        data: { city: capitalizedCity, code: codeNumber, post },
      });
    }
    return prisma.postalCode.create({
      data: { city: capitalizedCity, code: codeNumber },
    });
  }

  edit(city, code, post) {
    let capitalizedCity = city
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    const codeNumber = Number(code);

    const allowedPosts = ["BH_POSTA", "POSTE_SRP", "HP_MOSTAR"];

    if (allowedPosts.includes(post)) {
      return prisma.postalCode.update({
        where: { code: codeNumber },
        data: { city: capitalizedCity, post },
      });
    }
    return prisma.postalCode.update({
      where: { code: codeNumber },
      data: { city: capitalizedCity },
    });
  }

  deleteCode(code) {
    const codeNumber = Number(code);

    return prisma.postalCode.delete({ where: { code: codeNumber } });
  }
}

const postalCodesModel = new PostalCodesModel();

export { postalCodesModel };
