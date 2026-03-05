import request from "supertest";
import { usersModel } from "../../models/usersModel.js";
import { app } from "../../app.js";

async function createAndLoginUser(newUser) {
  const createUserData = {
    username: newUser.username,
    password: "123123",
    email: newUser.email,
    ["confirm-password"]: "123123",
    isAdmin: newUser.isAdmin || false,
  };
  await request(app).post("/auth/signup").send(createUserData);

  await usersModel.update(
    { username: createUserData.username },
    { isEmailConfirmed: true },
  );

  const requestData = {
    username: newUser.username,
    password: "123123",
  };
  const responseData = await request(app).post("/auth/login").send(requestData);

  return responseData;
}

export { createAndLoginUser };
