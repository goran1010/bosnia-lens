import request from "supertest";

export default async function createAndLoginUser(newUser, prisma, app) {
  const createUserData = {
    username: newUser.username,
    password: "123123",
    email: newUser.email,
    ["confirm-password"]: "123123",
  };
  await request(app).post("/users/signup").send(createUserData);

  await prisma.user.update({
    where: { username: createUserData.username },
    data: { isEmailConfirmed: true },
  });

  const requestData = {
    username: newUser.username,
    password: "123123",
  };
  const responseData = await request(app)
    .post("/users/login")
    .send(requestData);

  return responseData;
}
