import request from "supertest";
import { describe, test, expect } from "vitest";
import { app } from "../../app.js";
import { createNewUser } from "../utils/createNewUser.js";
import { emailConfirmHTML } from "../../utils/emailConfirmHTML.js";
import { pendingUserModel } from "../../models/pendingUsersModel.js";

describe("Auth Router - POST /auth/signup", () => {
  test("responds with status 201 and Registration successful! Check your email message if user created successfully", async () => {
    const newUser = createNewUser();

    const responseData = {
      data: expect.any(Object),
      message: "Registration successful! Check your email.",
    };
    const response = await request(app).post("/auth/signup").send(newUser);

    expect(response.body).toEqual(responseData);
    expect(response.status).toBe(201);
  });
});

describe("Auth Router - GET /auth/confirm/:token", () => {
  test("responds with status 200 and Email confirmed successfully message if token is valid", async () => {
    const agent = request.agent(app);
    const newUser = createNewUser();
    await agent.post("/auth/signup").send(newUser);

    const users = await pendingUserModel.findMany({
      email: newUser.email,
    });
    const token = users[0].token;

    const response = await agent.get(`/auth/confirm/${token}`);

    expect(response.text).toContain(emailConfirmHTML());
    expect(response.status).toBe(200);
  });
});

describe("Auth Router - POST /auth/login", () => {
  test("responds with status 200 and access token if login is successful", async () => {
    const agent = request.agent(app);
    const newUser = createNewUser();
    await agent.post("/auth/signup").send(newUser);

    const users = await pendingUserModel.findMany({
      email: newUser.email,
    });
    const token = users[0].token;

    await agent.get(`/auth/confirm/${token}`);

    const response = await agent.post("/auth/login").send({
      username: newUser.username,
      password: newUser.password,
    });

    expect(response.body.message).toBe("Logged in successfully");
    expect(response.status).toBe(200);
  });
});
