import request from "supertest";
import { describe, test, expect, vi } from "vitest";
import { app } from "../../app.js";
import { createAndLoginUser } from "../utils/createUserAndLogin.js";
import { usersModel } from "../../models/usersModel.js";

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
