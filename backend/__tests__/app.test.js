import { describe, test, expect, vi, beforeEach } from "vitest";
import request from "supertest";

beforeEach(() => {
  vi.resetModules();
});

describe("app", () => {
  test("app should be defined", async () => {
    const { app } = await import("../app.js");
    expect(app).toBeDefined();
  });

  test("app responds with status 500 if an unexpected error occurs", async () => {
    vi.doMock("../utils/rateLimiter.js", () => ({
      global: vi.fn((req, res, next) => next()),
      api: vi.fn(() => {
        throw new Error("Unexpected error");
      }),
      auth: vi.fn(),
      users: vi.fn(),
    }));
    const { app } = await import("../app.js");

    const response = await request(app).get("/api");

    expect(response.body).toEqual({
      error: {
        message: "Server error: please try again later.",
      },
    });
    expect(response.status).toBe(500);
  });

  test("app responds with status 404 for unknown routes", async () => {
    const { app } = await import("../app.js");

    const response = await request(app).get("/unknown-route");

    expect(response.body).toEqual({
      error: {
        message: "Route not found: check the URL and HTTP method.",
      },
    });
    expect(response.status).toBe(404);
  });
});
