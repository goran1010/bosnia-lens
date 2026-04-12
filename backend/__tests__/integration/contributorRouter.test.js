import request from "supertest";
import { describe, test, expect } from "vitest";
import { app } from "../../app.js";
import { createAndLoginUser } from "../utils/createUserAndLogin.js";
import { postalCodesModel } from "../../models/postalCodesModel.js";
import { usersModel } from "../../models/usersModel.js";

describe("Contributor Router - POST /contributor/postal-codes", () => {
  test("Responds with status 201 and message if postal code created successfully", async () => {
    await postalCodesModel.deleteCode("12345");

    const agent = request.agent(app);
    const loginResponse = await createAndLoginUser(agent, {
      role: "CONTRIBUTOR",
    });
    const newPostalCode = { city: "Test", code: "12345", post: "BH_POSTA" };

    const response = await agent
      .post("/users/contributor/postal-codes")
      .query(newPostalCode);

    expect(response.header["content-type"]).toMatch(/json/);

    expect(response.body).toEqual({
      message: "New postal code row created.",
      data: {
        ...newPostalCode,
        id: expect.any(String),
        code: Number(newPostalCode.code),
      },
    });
    expect(response.status).toBe(201);

    await postalCodesModel.deleteCode("12345");
    await usersModel.deleteUser({ id: loginResponse.body.data.id });
  });
});

describe("Contributor Router - PUT /contributor/postal-codes", () => {
  test("Responds with status 201 and message if postal code edited successfully", async () => {
    await postalCodesModel.deleteCode("12345");

    const agent = request.agent(app);
    const loginResponse = await createAndLoginUser(agent, {
      role: "CONTRIBUTOR",
    });

    await postalCodesModel.createNew("Test", "12345", "BH_POSTA");

    const editedPostalCode = {
      city: "Edited Test",
      code: "12345",
      post: "HP_MOSTAR",
    };

    const response = await agent
      .put("/users/contributor/postal-codes")
      .query(editedPostalCode);

    expect(response.header["content-type"]).toMatch(/json/);

    expect(response.body).toEqual({
      message: "Postal code row edited.",
      data: {
        ...editedPostalCode,
        id: expect.any(String),
        code: Number(editedPostalCode.code),
      },
    });
    expect(response.status).toBe(201);

    await postalCodesModel.deleteCode("12345");
    await usersModel.deleteUser({ id: loginResponse.body.data.id });
  });
});

describe("Contributor Router - DELETE /contributor/postal-codes", () => {
  test("Responds with status 200 and message if postal code deleted successfully", async () => {
    await postalCodesModel.deleteCode("12345");

    const agent = request.agent(app);
    const loginResponse = await createAndLoginUser(agent, {
      role: "CONTRIBUTOR",
    });

    await postalCodesModel.createNew("Test", "12345", "BH_POSTA");

    const response = await agent
      .delete("/users/contributor/postal-codes")
      .query({ code: "12345" });

    expect(response.header["content-type"]).toMatch(/json/);

    expect(response.body).toEqual({
      message: "Postal code row deleted.",
      data: { count: 1 },
    });
    expect(response.status).toBe(200);

    await postalCodesModel.deleteCode("12345");
    await usersModel.deleteUser({ id: loginResponse.body.data.id });
  });
});
