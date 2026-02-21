import request from "supertest";
import { describe, test, expect, vi } from "vitest";
import { app } from "../../app.js";
import { createAndLoginUser } from "../utils/createUserAndLogin.js";
import { createNewUserData } from "../utils/createNewUser.js";
import { afterEach } from "vitest";
import * as usersModel from "../../models/usersModel.js";
import jwt from "jsonwebtoken";
import { emailConfirmHTML } from "../../utils/emailConfirmHTML.js";

vi.mock("../../email/confirmationEmail.js", () => ({
  default: async () => {
    return { success: true };
  },
}));

afterEach(async () => {
  await usersModel.deleteAll();
});

describe("authRouter", () => {
  test("responds with status 200 and user data if logged in", async () => {
    const agent = request.agent(app);

    const userData = {
      username: "test_user_auth",
      password: "123123",
      email: "test_user_auth@mailll.com",
      ["confirm-password"]: "123123",
    };
    await agent.post("/users/signup").send(userData);

    const accessToken = jwt.sign(
      { email: userData.email, username: userData.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    await agent.get(`/users/confirm/${accessToken}`);

    await agent.post("/users/login").send({
      username: userData.username,
      password: userData.password,
    });

    const response = await agent.get("/auth/me");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        username: userData.username,
        email: userData.email,
      }),
    );
  });
});

describe("usersRouter", () => {
  test("successfully create a user and returns status 201 and message", async () => {
    const responseData = {
      message: "Registration successful! Check your email.",
    };

    const newUserData = createNewUserData();

    const response = await request(app).post("/users/signup").send(newUserData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(responseData);
  });

  test("responds with 200 and User test_user logged in successfully for correct login input", async () => {
    const newUserData = createNewUserData();

    const response = await createAndLoginUser(newUserData);

    const expectedData = {
      message: `Logged in successfully`,
    };

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(expectedData.message);
  });

  test("responds User logged out successfully", async () => {
    const agent = request.agent(app);

    const userData = {
      username: "test_user_auth",
      password: "123123",
      email: "test_user_auth@mailll.com",
      ["confirm-password"]: "123123",
    };
    await agent.post("/users/signup").send(userData);

    const accessToken = jwt.sign(
      { email: userData.email, username: userData.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    await agent.get(`/users/confirm/${accessToken}`);

    await agent.post("/users/login").send({
      username: userData.username,
      password: userData.password,
    });

    const response = await agent.post("/users/logout");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "User logged out successfully",
    });
  });

  test("responds with status 200 and HTML for valid token", async () => {
    const { username, password, email } = createNewUserData();
    const userInDB = await usersModel.create({
      username,
      password,
      email,
    });

    const accessToken = jwt.sign(
      { email: userInDB.email, username: userInDB.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30d" },
    );

    const response = await request(app).get(`/users/confirm/${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.text).toContain(emailConfirmHTML());
  });
});
