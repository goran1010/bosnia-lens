/* eslint-disable no-console */
import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client.js";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Database URL not found in environment variables.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const filePath = path.resolve(__dirname, "JSON_files/postal_codes.json");
const JSONdata = fs.readFileSync(filePath, "utf-8");
let postalCodes = JSON.parse(JSONdata);

const postMapping = {
  "BH Pošta": "BH_POSTA",
  "Pošte Srpske": "POSTE_SRP",
  "HP Mostar": "HP_MOSTAR",
};

postalCodes = postalCodes.map((postalCode) => ({
  ...postalCode,
  post: postMapping[postalCode.post] ?? null,
}));

async function main() {
  console.log("Seeding postal codes...");

  const result = await prisma.postalCode.createMany({
    data: postalCodes.map((postalCode) => ({
      code: Number(postalCode.postalCode),
      city: postalCode.city,
      post: postalCode.post,
    })),
    skipDuplicates: true,
  });

  console.log(`Inserted ${result.count} new postal codes.`);
}

main()
  .catch((error) => {
    console.error("Error seeding postal codes:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
