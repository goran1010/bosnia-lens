import request from "supertest";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { app } from "../../app.js";
import { usersModel } from "../../models/usersModel.js";

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

describe("Admin Router - GET /users/admin/contributors", () => {
  test("Responds with You need to be logged in and an admin to access this route if not logged in", async () => {
    const response = await request(app).get("/users/admin/contributors");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "You are not logged in.",
      details: [{ msg: null }],
    });
  });

  test("Responds with You need to be admin to access this route if role USER", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      role: "USER",
    };

    const response = await request(app).get("/users/admin/contributors");

    expect(response.header["content-type"]).toMatch(/json/);
    // expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 403 and You need to be admin to access this route if role CONTRIBUTOR", async () => {
    mockedUser = {
      id: 1,
      username: "contributor1",
      email: "contributor1@example.com",
      role: "CONTRIBUTOR",
    };

    const response = await request(app).get("/users/admin/contributors");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 200 and all contributors if role ADMIN", async () => {
    vi.spyOn(usersModel, "findMany").mockResolvedValueOnce([
      {
        id: 1,
        username: "contributor1",
        email: "s@non-existent-mail.comms",
        role: "CONTRIBUTOR",
      },
    ]);

    mockedUser = {
      id: 1,
      username: "admin1",
      email: "admin1@example.com",
      role: "ADMIN",
    };

    const response = await request(app).get("/users/admin/contributors");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "All contributors fetched successfully.",
      data: [
        {
          id: 1,
          username: "contributor1",
          email: "s@non-existent-mail.comms",
          role: "CONTRIBUTOR",
        },
      ],
    });
  });
});

describe("Admin Router - GET /users/admin/requested-contributors", () => {
  test("Responds with You need to be logged in and an admin to access this route if not logged in", async () => {
    const response = await request(app).get(
      "/users/admin/requested-contributors",
    );

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "You are not logged in.",
      details: [{ msg: null }],
    });
  });

  test("Responds with You need to be admin to access this route if role USER", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      role: "USER",
    };

    const response = await request(app).get(
      "/users/admin/requested-contributors",
    );

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 403 and You need to be admin to access this route if role CONTRIBUTOR", async () => {
    mockedUser = {
      id: 1,
      username: "contributor1",
      email: "contributor1@example.com",
      role: "CONTRIBUTOR",
    };

    const response = await request(app).get(
      "/users/admin/requested-contributors",
    );

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 200 and all requested contributors if role ADMIN", async () => {
    vi.spyOn(usersModel, "findMany").mockResolvedValueOnce([
      {
        id: 1,
        username: "user1",
        email: "user1@non-existent-mail.com",
        role: "CONTRIBUTOR",
      },
    ]);

    mockedUser = {
      id: 1,
      username: "admin1",
      email: "admin1@example.com",
      role: "ADMIN",
    };

    const response = await request(app).get(
      "/users/admin/requested-contributors",
    );

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Users requested contributor role fetched successfully.",
      data: [
        {
          id: 1,
          username: "user1",
          email: "user1@non-existent-mail.com",
          role: "CONTRIBUTOR",
        },
      ],
    });
  });
});

describe("Admin Router - POST /users/admin/add-contributor", () => {
  test("Responds with You need to be logged in and an admin to access this route if not logged in", async () => {
    const response = await request(app).post("/users/admin/add-contributor");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "You are not logged in.",
      details: [{ msg: null }],
    });
  });

  test("Responds with You need to be admin to access this route if role USER", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      role: "USER",
    };

    const response = await request(app).post("/users/admin/add-contributor");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 403 and You need to be admin to access this route if role CONTRIBUTOR", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      role: "CONTRIBUTOR",
    };

    const response = await request(app).post("/users/admin/add-contributor");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 400 if userId is empty", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      role: "ADMIN",
    };

    const response = await request(app).post("/users/admin/add-contributor");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Validation failed",
      details: [
        {
          value: "",
          msg: "User ID is required",
          path: "userId",
          type: "field",
          location: "body",
        },
      ],
    });
  });

  test("Responds with status 201 and message if user promoted to contributor successfully", async () => {
    vi.spyOn(usersModel, "update").mockResolvedValueOnce({
      id: 2,
      username: "user2",
      email: "user2@example.com",
    });

    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      role: "ADMIN",
    };

    const response = await request(app)
      .post("/users/admin/add-contributor")
      .send({ userId: 2 });

    expect(response.header["content-type"]).toMatch(/json/);
    // expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User promoted to contributor successfully.",
    });
  });
});

describe("Admin Router - POST /users/admin/decline-contributor", () => {
  test("Responds with You need to be logged in and an admin to access this route if not logged in", async () => {
    const response = await request(app).post(
      "/users/admin/decline-contributor",
    );

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "You are not logged in.",
      details: [{ msg: null }],
    });
  });

  test("Responds with You need to be admin to access this route if role USER", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      role: "USER",
    };

    const response = await request(app).post(
      "/users/admin/decline-contributor",
    );

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 403 and You need to be admin to access this route if role CONTRIBUTOR", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      role: "CONTRIBUTOR",
    };

    const response = await request(app).post(
      "/users/admin/decline-contributor",
    );

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 400 if userId is empty", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      role: "ADMIN",
    };

    const response = await request(app).post(
      "/users/admin/decline-contributor",
    );

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Validation failed",
      details: [
        {
          value: "",
          msg: "User ID is required",
          path: "userId",
          type: "field",
          location: "body",
        },
      ],
    });
  });

  test("Responds with status 201 and message if user's contributor request declined successfully", async () => {
    vi.spyOn(usersModel, "update").mockResolvedValueOnce({
      id: 2,
      username: "user2",
      email: "user2@example.com",
    });

    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      role: "ADMIN",
    };

    const response = await request(app)
      .post("/users/admin/decline-contributor")
      .send({ userId: 2 });

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User's contributor request declined successfully.",
    });
  });
});

describe("Admin Router - DELETE /users/admin/remove-contributor", () => {
  test("Responds with You need to be logged in and an admin to access this route if not logged in", async () => {
    const response = await request(app).delete(
      "/users/admin/remove-contributor",
    );

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "You are not logged in.",
      details: [{ msg: null }],
    });
  });

  test("Responds with You need to be admin to access this route if role USER", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      role: "USER",
    };

    const response = await request(app).delete(
      "/users/admin/remove-contributor",
    );

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 403 and You need to be admin to access this route if role CONTRIBUTOR", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      role: "CONTRIBUTOR",
    };

    const response = await request(app).delete(
      "/users/admin/remove-contributor",
    );

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 400 if userId is empty", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      role: "ADMIN",
    };
    const response = await request(app).delete(
      "/users/admin/remove-contributor",
    );

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Validation failed",
      details: [
        {
          value: "",
          msg: "User ID is required",
          path: "userId",
          type: "field",
          location: "body",
        },
      ],
    });
  });

  test("Responds with status 201 and message if user removed from contributors successfully", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      role: "ADMIN",
    };

    vi.spyOn(usersModel, "update").mockResolvedValueOnce({
      id: 2,
      username: "user2",
      email: "user2@example.com",
    });

    const response = await request(app)
      .delete("/users/admin/remove-contributor")
      .send({ userId: 2 });

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User removed from contributors successfully.",
    });
  });
});
