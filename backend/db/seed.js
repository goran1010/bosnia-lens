/* eslint-disable no-console */
import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const DATABASE_URL = process.env.DATABASE_URL;
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

const connectionString =
  process.env.NODE_ENV === "test" ? TEST_DATABASE_URL : DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const filePath = path.resolve(__dirname, "JSON_files/postal_codes.json");
const JSONdata = fs.readFileSync(filePath, "utf-8");
let postalCodes = JSON.parse(JSONdata);

function covertPostNamesToEnum() {
  const postMapping = {
    "BH Pošta": "BH_POSTA",
    "Pošte Srpske": "POSTE_SRP",
    "HP Mostar": "HP_MOSTAR",
  };

  postalCodes = postalCodes.map((postalCode) => ({
    ...postalCode,
    post: postMapping[postalCode.post] || postalCode.post,
  }));
}
covertPostNamesToEnum();

function replaceInvalidPostsWithNull() {
  const validPosts = ["BH_POSTA", "POSTE_SRP", "HP_MOSTAR"];

  postalCodes = postalCodes.map((postalCode) => ({
    ...postalCode,
    post: validPosts.includes(postalCode.post) ? postalCode.post : null,
  }));
}

replaceInvalidPostsWithNull();

async function seedPostalCodes() {
  try {
    console.log("Seeding postal codes...");

    const result = await prisma.postalCode.createMany({
      data: postalCodes.map((postalCode) => ({
        code: Number(postalCode.postalCode),
        city: postalCode.city,
        post: postalCode.post,
      })),
      skipDuplicates: true,
    });

    console.log("Postal codes seeded successfully.");
    console.log(`Inserted ${result.count} new postal codes.`);
  } catch (error) {
    console.error("Error seeding postal codes:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

await seedPostalCodes();
