import request from "supertest";
import { describe, test, expect, vi, beforeEach } from "vitest";

const isAuthenticatedMock = vi.fn();

vi.mock("../../auth/isAuthenticated.js", () => ({
  default: (req, res, next) => isAuthenticatedMock(req, res, next),
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

    const response = await request(app).get("/auth/me");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual(notLoggedInResponse);
  });

  test("responds with status 200 and user data if logged in", async () => {
    const user = { email: "test_email@mail.com", username: "test_username" };

    isAuthenticatedMock.mockImplementation((req, res, next) => {
      req.user = user;
      next();
    });

    const response = await request(app).get("/auth/me");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: user });
  });
});
