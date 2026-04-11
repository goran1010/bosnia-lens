import request from "supertest";
import { describe, test, expect } from "vitest";
import { app } from "../../app.js";
import { createNewUser } from "../utils/createNewUser.js";
import { emailConfirmHTML } from "../../utils/emailConfirmHTML.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
import jwt from "jsonwebtoken";

describe("Auth Router - POST /auth/signup", () => {
  test("responds with status 201 and Registration successful! Check your email message if user created successfully", async () => {
    const newUser = createNewUser();

    const responseData = {
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
    const user = createNewUser();
    await agent.post("/auth/signup").send(user);

    const token = jwt.sign(
      { email: user.email, username: user.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    const response = await agent.get(`/auth/confirm/${token}`);

    expect(response.status).toBe(200);
    expect(response.text).toContain(emailConfirmHTML());
  });
});

describe("Auth Router - POST /auth/login", () => {
  test("responds with status 200 and access token if login is successful", async () => {
    const agent = request.agent(app);
    const user = createNewUser();
    await agent.post("/auth/signup").send(user);

    const token = jwt.sign(
      { email: user.email, username: user.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    await agent.get(`/auth/confirm/${token}`);

    const response = await agent.post("/auth/login").send({
      username: user.username,
      password: user.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logged in successfully");
    expect(response.body.data.username).toEqual(user.username);
  });
});
