import prisma from "../db/prisma.js";

export async function getUserByUsername(username) {
  return await prisma.user.findUnique({ where: { username } });
}

export async function getUserByEmail(email) {
  return await prisma.user.findUnique({ where: { email } });
}
