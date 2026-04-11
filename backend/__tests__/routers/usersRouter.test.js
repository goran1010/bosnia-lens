import request from "supertest";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { usersModel } from "../../models/usersModel.js";
import { createNewUser } from "../utils/createNewUser.js";

vi.mock("csrf-sync", () => {
  const originalModule = vi.importActual("csrf-sync");
  return {
    ...originalModule,
    csrfSync: () => ({
      csrfSynchronisedProtection: (req, res, next) => next(),
    }),
  };
});

const isAuthenticatedMock = vi.fn();

vi.mock("../../auth/isAuthenticated.js", () => ({
  isAuthenticated: (req, res, next) => isAuthenticatedMock(req, res, next),
}));

import { app } from "../../app.js";

beforeEach(() => {
  vi.clearAllMocks();
  // Set default behavior
  isAuthenticatedMock.mockImplementation((req, res, next) => {
    if (req.user) return next();
    res.status(403).json({ error: "You need to be logged in." });
  });
});

describe("GET /me", () => {
  test("responds with status 403 and Need to be logged in if not logged in", async () => {
    const notLoggedInResponse = {
      error: "You need to be logged in.",
    };

    const response = await request(app).get("/users/me");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual(notLoggedInResponse);
    expect(response.status).toBe(403);
  });

  test("responds with status 200 and user data if logged in", async () => {
    const user = { email: "test_email@mail.com", username: "test_username" };

    isAuthenticatedMock.mockImplementation((req, res, next) => {
      req.user = user;
      next();
    });

    const response = await request(app).get("/users/me");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({
      message: "User info retrieved",
      data: user,
    });
    expect(response.status).toBe(200);
  });
});

describe("POST /become-contributor", () => {
  test("responds with status 403 and Only regular users can request contributor status if user is not a regular user", async () => {
    const user = {
      email: "test_email@mail.com",
      username: "test_username",
      role: "ADMIN",
    };

    isAuthenticatedMock.mockImplementation((req, res, next) => {
      req.user = user;
      next();
    });

    const response = await request(app)
      .post("/users/become-contributor")
      .set("Cookie", "sessionId=valid-session-id");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({
      error: "Only regular users can request contributor status",
      details: [{ msg: null }],
    });
    expect(response.status).toBe(403);
  });

  // test("responds with status 200 and message if request to become contributor successful", async () => {
  //   const agent = request.agent(app);

  //   const newUser = createNewUser();
  //   await agent.post("/auth/signup").send(newUser);

  //   await usersModel.update(
  //     { username: newUser.username },
  //     { isEmailConfirmed: true },
  //   );

  //   const requestData = {
  //     username: newUser.username,
  //     password: "123123",
  //   };
  //   await agent.post("/auth/login").send(requestData);

  //   const response = await agent.post("/users/become-contributor");

  //   expect(response.header["content-type"]).toMatch(/json/);
  //   expect(response.body).toEqual({
  //     message:
  //       "You've asked to become a contributor! An admin will review your request soon.",
  //     data: expect.objectContaining({
  //       requestedContributor: true,
  //     }),
  //   });
  //   expect(response.status).toBe(200);

  //   await usersModel.deleteUser({ id: newUser.id });
  // });
});

describe("POST /logout", () => {
  test("responds User logged out successfully", async () => {
    isAuthenticatedMock.mockImplementation((req, res, next) => {
      req.user = { id: 1 };
      req.logout = (cb) => cb(null);
      next();
    });

    const response = await request(app).post("/users/logout");

    expect(response.body).toEqual({
      message: "User logged out successfully",
    });
    expect(response.status).toBe(200);
  });
});
