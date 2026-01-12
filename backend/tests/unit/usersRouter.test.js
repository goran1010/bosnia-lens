import request from "supertest";
import app from "../../app.js";
import jwt from "jsonwebtoken";
import { describe, test, expect, vi } from "vitest";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
import emailConfirmHTML from "../../utils/emailConfirmHTML.js";
import createAndLoginUser from "./utils/createUserAndLogin.js";
import removeUserFromDB from "./utils/removeUserFromDB.js";
import createNewUser from "./utils/createNewUser.js";
import createUserInDB from "./utils/createUserInDB.js";
import * as usersModel from "../../models/usersModel.js";
import sendConfirmationEmail from "../../email/confirmationEmail.js";
import bcrypt from "bcryptjs";

vi.mock("../../email/confirmationEmail.js", () => ({
  default: vi.fn(() => {
    return {
      success: true,
    };
  }),
}));

describe("POST /signup", () => {
  test("responds with status 400 and message for incorrect username input", async () => {
    const newUser = createNewUser({ username: "user" });

    const responseData = {
      error: "Validation failed",
      details: [
        {
          type: "field",
          value: newUser.username,
          msg: "Username must be at least 6 characters long",
          path: "username",
          location: "body",
        },
      ],
    };

    const response = await request(app).post("/users/signup").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(responseData);
  });

  test("responds with status 400 and message for incorrect password input", async () => {
    const newUser = createNewUser({
      password: "123",
      "confirm-password": "123",
    });

    const responseData = {
      error: "Validation failed",
      details: [
        {
          type: "field",
          value: newUser.password,
          msg: "Password must be at least 6 characters long",
          path: "password",
          location: "body",
        },
      ],
    };

    const response = await request(app).post("/users/signup").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(responseData);
  });

  test("responds with status 400 and message for incorrect confirm-password input", async () => {
    const newUser = createNewUser({
      "confirm-password": "123",
    });

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

    const response = await request(app).post("/users/signup").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(responseData);
  });

  test("successfully create a user and returns status 201 and message", async () => {
    vi.spyOn(usersModel, "find").mockResolvedValueOnce();
    vi.spyOn(usersModel, "create").mockResolvedValueOnce(true);

    const responseData = {
      message: "Registration successful! Check your email.",
    };

    const newUser = createNewUser();

    const response = await request(app).post("/users/signup").send(newUser);

    expect(sendConfirmationEmail).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body).toEqual(responseData);
  });

  test("responds with json 400, Username already taken, if given username exists", async () => {
    const newUser = createNewUser();
    vi.spyOn(usersModel, "find").mockResolvedValueOnce({
      username: newUser.username,
    });

    const responseData = {
      error: "Validation failed",
      details: [
        {
          type: "field",
          value: newUser.username,
          msg: "Username already in use",
          path: "username",
          location: "body",
        },
      ],
    };

    const response = await request(app).post("/users/signup").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(responseData);
  });
});

describe("POST /login", () => {
  test("responds with Invalid username or password for wrong input", async () => {
    vi.spyOn(usersModel, "find").mockResolvedValueOnce();

    const newUser = createNewUser();

    const responseData = { error: "Invalid username or password" };

    const response = await request(app).post("/users/login").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(responseData);
  });

  test("responds with User test_user logged in successfully for correct input", async () => {
    vi.spyOn(bcrypt, "compareSync").mockResolvedValueOnce(true);

    const newUser = createNewUser();
    vi.spyOn(usersModel, "find").mockResolvedValueOnce({
      ...newUser,
      isEmailConfirmed: true,
    });
    const response = await request(app).post("/users/login").send(newUser);

    const responseData = {
      message: `User ${newUser.username} logged in successfully`,
    };

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(responseData.message);

    expect(response.body.data).toHaveProperty("accessToken");
  });
});

describe("POST /logout", () => {
  test("responds User logged out successfully", async () => {
    const newUser = createNewUser();

    const accessToken = jwt.sign(
      { email: newUser.email, username: newUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    const response = await request(app)
      .post("/users/logout")
      .set("Authorization", `Token ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.request.cookies).not.toMatch(/refreshToken/);
    expect(response.body).toEqual({
      message: "User logged out successfully",
    });
  });
});

describe("GET //refresh-token", () => {
  test("responds with status 401 and message if no refresh token given", async () => {
    const response = await request(app).get("/users/refresh-token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "No refresh token provided" });
  });

  test("responds with status 403 and message if invalid refresh token", async () => {
    const response = await request(app)
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

    const response = await request(app)
      .get("/users/refresh-token")
      .set("Cookie", [`refreshToken=${refreshToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("accessToken");
  });
});

describe("GET /confirm/:token", () => {
  test("responds with status 404 and message for no token provided", async () => {
    const response = await request(app).get("/users/confirm/");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "No resource found" });
  });

  test("responds with status 400 and message for invalid token", async () => {
    const response = await request(app).get("/users/confirm/12345");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid or expired token" });
  });

  test("responds with status 200 and HTML for valid token", async () => {
    const newUser = createNewUser();

    const accessToken = jwt.sign(
      { email: newUser.email, username: newUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    vi.spyOn(usersModel, "find").mockResolvedValueOnce({
      isEmailConfirmed: false,
    });
    vi.spyOn(usersModel, "update").mockResolvedValueOnce({});

    const response = await request(app).get(`/users/confirm/${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.text).toContain(emailConfirmHTML());
  });
});
