import prisma from "../../../db/prisma";
import createNewUser from "./createNewUser";

export default async function createUserInDB(newUser) {
  const { username, password, email } = createNewUser(newUser);

  return await prisma.user.create({
    data: {
      username,
      password,
      email,
    },
  });
}
