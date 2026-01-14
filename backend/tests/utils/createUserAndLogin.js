import request from "supertest";
import * as usersModel from "../../models/usersModel.js";
import app from "../../app";

export default async function createAndLoginUser(newUser) {
  const createUserData = {
    username: newUser.username,
    password: "123123",
    email: newUser.email,
    ["confirm-password"]: "123123",
  };
  await request(app).post("/users/signup").send(createUserData);

  await usersModel.update(
    { username: createUserData.username },
    { isEmailConfirmed: true },
  );

  const requestData = {
    username: newUser.username,
    password: "123123",
  };
  const responseData = await request(app)
    .post("/users/login")
    .send(requestData);

  return responseData;
}
