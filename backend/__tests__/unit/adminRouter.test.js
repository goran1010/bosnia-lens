import request from "supertest";
import { describe, test, expect, vi, beforeEach } from "vitest";

const isAdminMock = vi.fn();

vi.mock("../../auth/isAdmin.js", () => ({
  isAdmin: (req, res, next) => isAdminMock(req, res, next),
}));

import { app } from "../../app.js";

beforeEach(() => {
  vi.clearAllMocks();
  // Set default behavior
  isAdminMock.mockImplementation((req, res, next) => {
    try {
      if (req.user?.isAdmin) return next();

      res.status(403).json({
        error: "You need to be admin to access this route.",
        details: [{ msg: null }],
      });
    } catch (err) {
      next(err);
    }
  });
});

describe("POST /admin/postal-codes", () => {
  test("responds with status 403 and You need to be admin to access this route if not logged in", async () => {
    const notLoggedInResponse = {
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    };

    const response = await request(app).post("/admin/postal-codes");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual(notLoggedInResponse);
  });
});
