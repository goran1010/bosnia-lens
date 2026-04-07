import request from "supertest";
import { describe, test, expect, vi } from "vitest";
import { app } from "../../app.js";
import { createAndLoginUser } from "../utils/createUserAndLogin.js";

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

  test("Responds with status 200 and list of contributors if role CONTRIBUTOR", async () => {
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
});
