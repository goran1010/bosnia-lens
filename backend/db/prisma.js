import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const DATABASE_URL = process.env.DATABASE_URL;
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Missing required environment variable: DATABASE_URL");
}

if (process.env.NODE_ENV === "test" && !TEST_DATABASE_URL) {
  throw new Error("Missing required environment variable: TEST_DATABASE_URL");
}

const connectionString =
  process.env.NODE_ENV === "test" ? TEST_DATABASE_URL : DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;
