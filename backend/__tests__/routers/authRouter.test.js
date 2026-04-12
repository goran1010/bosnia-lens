import { describe, test, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../app.js";
import { emailConfirmHTML } from "../../utils/emailConfirmHTML.js";
import { createNewUser } from "../utils/createNewUser.js";
import { usersModel } from "../../models/usersModel.js";
import { sendConfirmationEmail } from "../../email/confirmationEmail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sanitizeUser } from "../../utils/sanitizeUser.js";

const isAuthenticatedMock = vi.fn();

vi.mock("../../auth/isAuthenticated.js", () => ({
  isAuthenticated: (req, res, next) => isAuthenticatedMock(req, res, next),
}));

beforeEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
  // Set default behavior
  isAuthenticatedMock.mockImplementation((req, res, next) => {
    if (req.user) return next();
    res.status(403).json({ error: "You need to be logged in." });
  });
});

describe("POST /auth/signup", () => {
  test("responds with status 400 and message for incorrect username input", async () => {
    const newUser = createNewUser({ username: "user" });

    const responseData = {
      error: {
        message: "Username must be at least 6 characters long",
      },
    };

    const response = await request(app).post("/auth/signup").send(newUser);

    expect(response.body.error.message).toContain(responseData.error.message);
    expect(response.status).toBe(400);
  });

  test("responds with status 400 and message for incorrect password input", async () => {
    const newUser = createNewUser({
      password: "123",
      "confirm-password": "123",
    });

    const responseData = {
      error: {
        message:
          "Password must be at least 6 characters long and contain at least one number",
      },
    };

    const response = await request(app).post("/auth/signup").send(newUser);

    expect(response.body.error.message).toContain(responseData.error.message);
    expect(response.status).toBe(400);
  });

  test("responds with status 400 and message for incorrect confirm-password input", async () => {
    const newUser = createNewUser({
      "confirm-password": "123",
    });

    const responseData = {
      error: {
        message: "Passwords do not match",
      },
    };

    const response = await request(app).post("/auth/signup").send(newUser);

    expect(response.body.error.message).toContain(responseData.error.message);
    expect(response.status).toBe(400);
  });

  test("successfully create a user and returns status 201 and message", async () => {
    const newUser = createNewUser();
    const createdUser = {
      id: "mock-user-id",
      username: newUser.username,
      email: newUser.email,
      isEmailConfirmed: false,
      role: "USER",
      requestedContributor: false,
      password: "hashed-password",
    };
    vi.spyOn(usersModel, "create").mockResolvedValueOnce(
      sanitizeUser(createdUser),
    );

    const response = await request(app).post("/auth/signup").send(newUser);

    expect(sendConfirmationEmail).toHaveBeenCalled();
    expect(response.body).toEqual({
      data: expect.objectContaining({
        username: newUser.username,
        email: newUser.email,
      }),
      message: "Registration successful! Check your email.",
    });
    expect(response.status).toBe(201);
  });

  test("responds with json 400, Username already taken, if given username exists", async () => {
    const newUser = createNewUser();
    vi.spyOn(usersModel, "findOne").mockResolvedValueOnce({
      username: newUser.username,
    });

    const responseData = {
      error: {
        message: "Username already in use",
      },
    };

    const response = await request(app).post("/auth/signup").send(newUser);

    expect(response.body.error.message).toContain(responseData.error.message);
    expect(response.status).toBe(400);
  });
});

describe("GET /auth/confirm/:token", () => {
  test("responds with status 404 and message for no token provided", async () => {
    const response = await request(app).get("/auth/confirm/");

    expect(response.body).toEqual({
      error: {
        message: "Route not found: check the URL and HTTP method.",
      },
    });
    expect(response.status).toBe(404);
  });

  test("responds with status 400 and message for invalid token", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await request(app).get("/auth/confirm/12345");

    expect(response.body).toEqual({
      error: {
        message:
          "Email confirmation failed: token is invalid or expired. Request a new confirmation email.",
      },
    });
    expect(response.status).toBe(500);
  });

  test("responds with status 200 and HTML for valid token", async () => {
    const newUser = createNewUser();

    const accessToken = jwt.sign(
      { email: newUser.email, username: newUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    vi.spyOn(usersModel, "findOne").mockResolvedValueOnce({
      isEmailConfirmed: false,
    });
    vi.spyOn(usersModel, "update").mockResolvedValueOnce(true);

    const response = await request(app).get(`/auth/confirm/${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.text).toContain(emailConfirmHTML());
  });
});

describe("POST /auth/login", () => {
  test("responds with Incorrect username for wrong input", async () => {
    const newUser = createNewUser();

    const responseData = {
      error: {
        message: "Incorrect username or password",
      },
    };

    const response = await request(app).post("/auth/login").send(newUser);

    expect(response.body.error.message).toContain(responseData.error.message);
    expect(response.status).toBe(401);
  });

  test("responds with User test_user logged in successfully for correct input", async () => {
    const newUser = createNewUser({ isEmailConfirmed: true });

    vi.spyOn(usersModel, "findOne").mockResolvedValueOnce(newUser);
    vi.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);

    const response = await request(app).post("/auth/login").send(newUser);

    const responseData = {
      message: `Logged in successfully`,
    };
    expect(response.body.message).toEqual(responseData.message);
    expect(response.status).toBe(200);
  });
});
