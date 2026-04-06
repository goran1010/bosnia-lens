import { describe, test, expect, vi } from "vitest";
import request from "supertest";

vi.mock("../utils/rateLimiter.js", () => ({
  global: () => {
    throw new Error("Test error");
  },
  api: (req, res, next) => next(),
  auth: (req, res, next) => next(),
  users: (req, res, next) => next(),
}));

describe("app", () => {
  test("app should be defined", async () => {
    const { app } = await import("../app.js");
    expect(app).toBeDefined();
  });

  test("app responds with status 500 if an unexpected error occurs", async () => {
    const { app } = await import("../app.js");

    const response = await request(app).get("/");

    expect(response.body).toEqual({
      error: "An unexpected error occurred.",
      details: [{ msg: "Test error" }],
    });
    expect(response.status).toBe(500);
  });
});
