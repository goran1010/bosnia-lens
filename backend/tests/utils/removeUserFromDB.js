import prisma from "../../db/prisma";

export default async function removeUserFromDB(newUser) {
  return await prisma.user.delete({ where: { username: newUser.username } });
}
