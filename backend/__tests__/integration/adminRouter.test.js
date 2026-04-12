import request from "supertest";
import { describe, test, expect } from "vitest";
import { app } from "../../app.js";
import { createAndLoginUser } from "../utils/createUserAndLogin.js";
import { createNewUser } from "../utils/createNewUser.js";
import { usersModel } from "../../models/usersModel.js";
import { sanitizeUser } from "../../utils/sanitizeUser.js";

describe("Admin Router - GET /users/admin/contributors", () => {
  test("Responds with status 200 and all contributors if role ADMIN", async () => {
    // eslint-disable-next-line no-unused-vars
    const { ["confirm-password"]: confirmPassword, ...userRequested } =
      createNewUser({ role: "CONTRIBUTOR" });

    const userInDb = await usersModel.create(userRequested);

    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "ADMIN" });

    const response = await agent.get("/users/admin/contributors");
    const safeUserInDb = sanitizeUser(userInDb);

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(
      "All contributors fetched successfully.",
    );
    expect(response.body.data).toContainEqual(safeUserInDb);
    await usersModel.deleteUser({ id: userInDb.id });
  });
});

describe("Admin Router - GET /users/admin/requested-contributors", () => {
  test("Responds with status 200 and all requested contributors if role ADMIN", async () => {
    // eslint-disable-next-line no-unused-vars
    const { ["confirm-password"]: confirmPassword, ...userRequested } =
      createNewUser({ requestedContributor: true });

    const userInDb = await usersModel.create(userRequested);

    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "ADMIN" });

    const response = await agent.get("/users/admin/requested-contributors");
    const safeUserInDb = sanitizeUser(userInDb);

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(
      "Users requested contributor role fetched successfully.",
    );
    expect(response.body.data).toContainEqual(safeUserInDb);
    await usersModel.deleteUser({ id: userInDb.id });
  });
});

describe("Admin Router - POST /users/admin/add-contributor", () => {
  test("Responds with status 201 and message if user promoted to contributor successfully", async () => {
    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "ADMIN" });

    // eslint-disable-next-line no-unused-vars
    const { ["confirm-password"]: confirmPassword, ...userRequested } =
      createNewUser({ requestedContributor: true });

    const userInDb = await usersModel.create(userRequested);

    const response = await agent
      .post("/users/admin/add-contributor")
      .send({ userId: userInDb.id });

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      data: expect.objectContaining({
        id: userInDb.id,
      }),
      message: "User promoted to contributor successfully.",
    });
    await usersModel.deleteUser({ id: userInDb.id });
  });
});

describe("Admin Router - POST /users/admin/decline-contributor", () => {
  test("Responds with status 201 and message if user's contributor request declined successfully", async () => {
    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "ADMIN" });

    // eslint-disable-next-line no-unused-vars
    const { ["confirm-password"]: confirmPassword, ...userRequested } =
      createNewUser({ requestedContributor: true });
    const userInDb = await usersModel.create(userRequested);

    const response = await agent
      .post("/users/admin/decline-contributor")
      .send({ userId: userInDb.id });

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      data: expect.objectContaining({
        id: userInDb.id,
      }),
      message: "User's contributor request declined successfully.",
    });
    await usersModel.deleteUser({ id: userInDb.id });
  });
});

describe("Admin Router - DELETE /users/admin/remove-contributor", () => {
  test("Responds with status 201 and message if user removed from contributors successfully", async () => {
    const agent = request.agent(app);
    await createAndLoginUser(agent, { role: "ADMIN" });

    // eslint-disable-next-line no-unused-vars
    const { ["confirm-password"]: confirmPassword, ...userContributor } =
      createNewUser({ role: "CONTRIBUTOR" });

    const userInDb = await usersModel.create(userContributor);

    const response = await agent
      .delete("/users/admin/remove-contributor")
      .send({ userId: userInDb.id });

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      data: expect.objectContaining({
        id: userInDb.id,
      }),
      message: "User removed from contributors successfully.",
    });
    await usersModel.deleteUser({ id: userInDb.id });
  });
});
