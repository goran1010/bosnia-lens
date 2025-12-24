import { PrismaClient } from "../prisma/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const DATABASE_URL = process.env.DATABASE_URL;
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Missing required environment variable: DATABASE_URL");
}

if (process.env.NODE_ENV === "test" && !TEST_DATABASE_URL) {
  throw new Error("Missing required environment variable: TEST_DATABASE_URL");
}

const databaseUrl =
  process.env.NODE_ENV === "test" ? TEST_DATABASE_URL : DATABASE_URL;

const adapter = new PrismaPg({ databaseUrl });
const prisma = new PrismaClient({ adapter });

export default prisma;
