import request from "supertest";
import app from "../app.js";
import prisma from "../db/prisma.js";
import jwt from "jsonwebtoken";
import { describe, test, expect, beforeEach } from "vitest";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

beforeEach(async () => {
  await prisma.user.deleteMany();
});

async function createAndLoginUser() {
  const createUserData = {
    username: "test_user",
    password: "123123",
    email: "example@mail.com",
    ["confirm-password"]: "123123",
  };
  await request(app).post("/users/signup").send(createUserData);

  await prisma.user.update({
    where: { username: createUserData.username },
    data: { isEmailConfirmed: true },
  });

  const requestData = {
    username: "test_user",
    password: "123123",
  };
  const responseData = await request(app)
    .post("/users/login")
    .send(requestData);

  return responseData;
}

describe("POST /signup", () => {
  test("responds with status 400 and message for incorrect username input", async () => {
    const responseData = {
      error: "Validation failed",
      details: [
        {
          type: "field",
          value: "user",
          msg: "Username must be at least 6 characters long",
          path: "username",
          location: "body",
        },
      ],
    };
    const requestData = {
      username: "user",
      email: "example@mail.com",
      password: "123123",
      ["confirm-password"]: "123123",
    };
    const response = await request(app).post("/users/signup").send(requestData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(responseData);
  });

  test("responds with status 400 and message for incorrect password input", async () => {
    const responseData = {
      error: "Validation failed",
      details: [
        {
          type: "field",
          value: "123",
          msg: "Password must be at least 6 characters long",
          path: "password",
          location: "body",
        },
      ],
    };
    const requestData = {
      username: "username",
      email: "example@mail.com",
      password: "123",
      ["confirm-password"]: "123",
    };
    const response = await request(app).post("/users/signup").send(requestData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(responseData);
  });

  test("responds with status 400 and message for incorrect confirm-password input", async () => {
    const responseData = {
      error: "Validation failed",
      details: [
        {
          type: "field",
          value: "123",
          msg: "Passwords do not match",
          path: "confirm-password",
          location: "body",
        },
      ],
    };
    const requestData = {
      username: "username",
      email: "example@mail.com",
      password: "123123",
      ["confirm-password"]: "123",
    };
    const response = await request(app).post("/users/signup").send(requestData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(responseData);
  });

  test("successfully create a user and returns status 201 and message", async () => {
    const responseData = {
      message: "Registration successful! Check your email.",
    };

    const requestData = {
      username: "test_user",
      password: "123123",
      ["confirm-password"]: "123123",
      email: "example@mail.com",
    };
    const response = await request(app).post("/users/signup").send(requestData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(responseData);
  });

  test("responds with json 400, Username already taken, if given username exists", async () => {
    const responseData = {
      error: "Validation failed",
      details: [
        {
          type: "field",
          value: "test_user",
          msg: "Username already in use",
          path: "username",
          location: "body",
        },
      ],
    };

    await prisma.user.create({
      data: {
        username: "test_user",
        password: "123123",
        email: "example@mail.com",
      },
    });

    const requestData = {
      username: "test_user",
      password: "123123",
      email: "example2@mail.com",
      ["confirm-password"]: "123123",
    };
    const response = await request(app).post("/users/signup").send(requestData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(responseData);
  });

  test("responds with json 400, Email already taken, if given email exists", async () => {
    const responseData = {
      error: "Validation failed",
      details: [
        {
          type: "field",
          value: "example@mail.com",
          msg: "Email already in use",
          path: "email",
          location: "body",
        },
      ],
    };

    await prisma.user.create({
      data: {
        username: "test_user",
        password: "123123",
        email: "example@mail.com",
      },
    });

    const requestData = {
      username: "test_user2",
      password: "123123",
      email: "example@mail.com",
      ["confirm-password"]: "123123",
    };
    const response = await request(app).post("/users/signup").send(requestData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(responseData);
  });
});

describe("POST /login", () => {
  test("responds with Invalid username or password for wrong input", async () => {
    await prisma.user.create({
      data: {
        username: "test_user",
        password: "123123",
        email: "example@mail.com",
      },
    });

    const responseData = { error: "Invalid username or password" };

    const requestData = {
      username: "test",
      password: "123123",
      confirmPassword: "123123",
    };
    const response = await request(app).post("/users/login").send(requestData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(responseData);
  });

  test("responds with User test_user logged in successfully for correct input", async () => {
    const responseData = await createAndLoginUser();

    const expectedData = {
      message: `User test_user logged in successfully`,
      accessToken: "randomstring",
    };

    expect(responseData.status).toBe(200);
    expect(responseData.body.message).toEqual(expectedData.message);

    expect(responseData.body.data).toHaveProperty("accessToken");
  });
});

describe("POST /logout", () => {
  test("responds User logged out successfully", async () => {
    const responseData = await createAndLoginUser();

    const response = await request(app)
      .post("/users/logout")
      .set("Authorization", `Token ${responseData.body.data.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "User logged out successfully" });
  });
});

describe("GET //refresh-token", () => {
  test("responds with status 401 and message if no refresh token given", async () => {
    const response = await request(app).get("/users/refresh-token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "No refresh token provided" });
  });

  test("responds with status 403 and message if invalid refresh token", async () => {
    const response = await request
      .agent(app)
      .get("/users/refresh-token")
      .set("Cookie", ["refreshToken=123"]);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: "Invalid refresh token" });
  });

  test("responds with status 200 and accessToken if valid refresh token", async () => {
    const refreshToken = jwt.sign(
      { id: 1, username: "test_user" },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" },
    );

    const response = await request
      .agent(app)
      .get("/users/refresh-token")
      .set("Cookie", [`refreshToken=${refreshToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("accessToken");
  });
});
