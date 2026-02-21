import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("express-session", () => {
  return {
    default: () => (req, res, next) => {
      req.session = {
        destroy: (cb) => cb(),
        touch: () => {},
        save: () => {},
      };
      next();
    },
  };
});

vi.mock("../../config/passport.js", async () => {
  const actual = await vi.importActual("../../config/passport.js");

  return {
    default: {
      ...actual.default,
      authenticate: vi.fn(),
      session: vi.fn(() => (req, res, next) => next()),
    },
  };
});

import request from "supertest";
import { app } from "../../app.js";

import { emailConfirmHTML } from "../../utils/emailConfirmHTML.js";
import { createNewUser } from "../utils/createNewUser.js";
import * as usersModel from "../../models/usersModel.js";
import { sendConfirmationEmail } from "../../email/confirmationEmail.js";
import jwt from "jsonwebtoken";
import { passport } from "../../config/passport.js";

const isAuthenticatedMock = vi.fn();

vi.mock("../../auth/isAuthenticated.js", () => ({
  default: (req, res, next) => isAuthenticatedMock(req, res, next),
}));

vi.mock("../../email/confirmationEmail.js", () => ({
  default: vi.fn(() => {
    return {
      success: true,
    };
  }),
}));

vi.mock("../../models/usersModel.js");

beforeEach(() => {
  vi.clearAllMocks();
  // Set default behavior
  isAuthenticatedMock.mockImplementation((req, res, next) => {
    if (req.user) return next();
    res.status(403).json({ error: "You need to be logged in." });
  });
});

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
  test("responds with Incorrect username for wrong input", async () => {
    const newUser = createNewUser();

    passport.authenticate.mockImplementation((strategy, callback) => (req) => {
      req.logIn = (user, cb) => cb(null);
      callback(null, undefined, { message: "Incorrect username" });
    });
    const responseData = { error: "Incorrect username" };

    const response = await request(app).post("/users/login").send(newUser);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(responseData);
  });

  test("responds with User test_user logged in successfully for correct input", async () => {
    const newUser = createNewUser();

    passport.authenticate.mockImplementation((strategy, callback) => (req) => {
      req.logIn = (user, cb) => cb(null);
      callback(null, newUser, null);
    });
    const response = await request(app).post("/users/login").send(newUser);

    const responseData = {
      message: `Logged in successfully`,
    };

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(responseData.message);
  });
});

describe("POST /logout", () => {
  test("responds User logged out successfully", async () => {
    isAuthenticatedMock.mockImplementation((req, res, next) => {
      req.user = { id: 1 };
      req.logout = (cb) => cb(null);
      next();
    });

    const response = await request(app).post("/users/logout");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "User logged out successfully",
    });
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

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Couldn't confirm email" });
  });

  test("responds with status 200 and HTML for valid token", async () => {
    const newUser = createNewUser();

    const accessToken = jwt.sign(
      { email: newUser.email, username: newUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    vi.spyOn(usersModel, "find").mockResolvedValueOnce({
      isEmailConfirmed: false,
    });

    const response = await request(app).get(`/users/confirm/${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.text).toContain(emailConfirmHTML());
  });
});
