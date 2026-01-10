import prisma from "../db/prisma.js";

export function getUserByUsername(username) {
  return prisma.user.findUnique({ where: { username } });
}

export function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export function updateEmailConfirmedByEmail(email) {
  return prisma.user.update({
    where: { email },
    data: { isEmailConfirmed: true },
  });
}

export function updateEmailConfirmedByUsername(username) {
  return prisma.user.update({
    where: { username },
    data: { isEmailConfirmed: true },
  });
}

export function createNewUser(username, email, password) {
  return prisma.user.create({
    data: {
      username,
      email,
      password,
    },
  });
}
