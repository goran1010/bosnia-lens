import request from "supertest";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { usersModel } from "../../models/usersModel.js";
import { createNewUser } from "../utils/createNewUser.js";
import { app } from "../../app.js";

let mockedUser = null;

vi.mock("../../auth/isAuthenticated.js", () => {
  return {
    isAuthenticated: (req, res, next) => {
      req.user = mockedUser;
      if (req.user) return next();

      res.status(401).json({
        error: "You are not logged in.",
        details: [{ msg: null }],
      });
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  mockedUser = null;
});

describe("GET /me", () => {
  test("responds with status 401 and You are not logged in if not logged in", async () => {
    const notLoggedInResponse = {
      error: "You are not logged in.",
      details: [{ msg: null }],
    };

    const response = await request(app).get("/users/me");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual(notLoggedInResponse);
    expect(response.status).toBe(401);
  });

  test("responds with status 200 and user data if logged in", async () => {
    const user = createNewUser();
    mockedUser = user;

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
    const user = createNewUser({ role: "CONTRIBUTOR" });
    mockedUser = user;

    const response = await request(app)
      .post("/users/become-contributor")
      .set("Cookie", "sessionId=valid-session-id");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({
      error: {
        message:
          "Request denied: only regular users can request contributor access.",
      },
    });
    expect(response.status).toBe(403);
  });

  test("responds with status 200 and message if request to become contributor successful", async () => {
    const user = createNewUser();
    mockedUser = user;

    vi.spyOn(usersModel, "update").mockResolvedValue({
      ...user,
      requestedContributor: true,
    });

    const response = await request(app).post("/users/become-contributor");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({
      message:
        "You've asked to become a contributor! An admin will review your request soon.",
      data: expect.objectContaining({
        requestedContributor: true,
      }),
    });
    expect(response.status).toBe(200);
  });
});

describe("POST /logout", () => {
  test("responds User logged out successfully", async () => {
    const user = createNewUser();
    mockedUser = user;

    const response = await request(app).post("/users/logout");

    expect(response.body).toEqual({
      data: {
        success: true,
      },
      message: "User logged out successfully",
    });
    expect(response.status).toBe(200);
  });
});
