import prisma from "../db/prisma.js";

export async function getAllUserByUsername(username) {
  return await prisma.user.findUnique({ where: { username } });
}

export async function getAllUserByEmail(email) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function updateEmailConfirmedByEmail(email) {
  return await prisma.user.update({
    where: { email: email },
    data: { isEmailConfirmed: true },
  });
}
