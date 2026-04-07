import request from "supertest";
import { describe, test, expect, vi } from "vitest";
import { app } from "../../app.js";
import { createAndLoginUser } from "../utils/createUserAndLogin.js";
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
    const agent = request.agent(app);
    await createAndLoginUser(agent);

    const response = await agent.get("/users/admin/contributors");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 403 and You need to be admin to access this route if role CONTRIBUTOR", async () => {
    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "CONTRIBUTOR" });

    const response = await agent.get("/users/admin/contributors");

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

    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "ADMIN" });

    const response = await agent.get("/users/admin/contributors");

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
    const agent = request.agent(app);
    await createAndLoginUser(agent);

    const response = await agent.get("/users/admin/requested-contributors");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 403 and You need to be admin to access this route if role CONTRIBUTOR", async () => {
    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "CONTRIBUTOR" });

    const response = await agent.get("/users/admin/requested-contributors");

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

    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "ADMIN" });

    const response = await agent.get("/users/admin/requested-contributors");

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
    const agent = request.agent(app);
    await createAndLoginUser(agent);

    const response = await agent.post("/users/admin/add-contributor");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 403 and You need to be admin to access this route if role CONTRIBUTOR", async () => {
    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "CONTRIBUTOR" });

    const response = await agent.post("/users/admin/add-contributor");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 400 if userId is empty", async () => {
    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "ADMIN" });

    const response = await agent.post("/users/admin/add-contributor/");

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
    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "ADMIN" });

    const userRequested = createNewUser({ requestedContributor: true });

    const createdUser = {
      username: userRequested.username,
      password: userRequested.password,
      email: userRequested.email,
      id: userRequested.id,
      role: "USER",
      requestedContributor: true,
    };
    const userInDb = await usersModel.create(createdUser);

    const response = await agent
      .post("/users/admin/add-contributor")
      .send({ userId: userInDb.id });

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(201);
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
    const agent = request.agent(app);
    await createAndLoginUser(agent);

    const response = await agent.post("/users/admin/decline-contributor");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 403 and You need to be admin to access this route if role CONTRIBUTOR", async () => {
    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "CONTRIBUTOR" });

    const response = await agent.post("/users/admin/decline-contributor");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 400 if userId is empty", async () => {
    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "ADMIN" });

    const response = await agent.post("/users/admin/decline-contributor");

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
    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "ADMIN" });

    const userRequested = createNewUser({ requestedContributor: true });

    const createdUser = {
      username: userRequested.username,
      password: userRequested.password,
      email: userRequested.email,
      id: userRequested.id,
      role: "USER",
      requestedContributor: true,
    };
    const userInDb = await usersModel.create(createdUser);

    const response = await agent
      .post("/users/admin/decline-contributor")
      .send({ userId: userInDb.id });

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
    const agent = request.agent(app);
    await createAndLoginUser(agent);

    const response = await agent.delete("/users/admin/remove-contributor");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 403 and You need to be admin to access this route if role CONTRIBUTOR", async () => {
    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "CONTRIBUTOR" });

    const response = await agent.delete("/users/admin/remove-contributor");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    });
  });

  test("Responds with status 400 if userId is empty", async () => {
    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "ADMIN" });

    const response = await agent.delete("/users/admin/remove-contributor");

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
    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "ADMIN" });

    const userContributor = createNewUser({ role: "CONTRIBUTOR" });

    const createdUser = {
      username: userContributor.username,
      password: userContributor.password,
      email: userContributor.email,
      id: userContributor.id,
      role: "CONTRIBUTOR",
      requestedContributor: false,
    };
    const userInDb = await usersModel.create(createdUser);

    const response = await agent
      .delete("/users/admin/remove-contributor")
      .send({ userId: userInDb.id });

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User removed from contributors successfully.",
    });
  });
});
