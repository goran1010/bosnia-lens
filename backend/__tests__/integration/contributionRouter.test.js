import request from "supertest";
import { describe, test, expect } from "vitest";
import { app } from "../../app.js";
import { createAndLoginUser } from "../utils/createUserAndLogin.js";
import { postalCodesModel } from "../../models/postalCodesModel.js";
import { pendingChangesPostalCodeModel } from "../../models/pendingChangesPostalCodeModel.js";
import { usersModel } from "../../models/usersModel.js";

describe("Contributor Router - POST /users/contribution/postal-codes", () => {
  test("Responds with status 201 and message if pending changes created successfully", async () => {
    await pendingChangesPostalCodeModel.delete({ code: 12345 });

    const agent = request.agent(app);
    const loginResponse = await createAndLoginUser(agent);
    const newPostalCode = { city: "Test", code: "12345", post: "BH_POSTA" };

    const response = await agent
      .post("/users/contribution/postal-codes")
      .send(newPostalCode);
    const expectedResponse = {
      status: 201,
      body: expect.objectContaining({
        message:
          "New postal code suggested. Admin will review the suggestion and decide whether to accept it or not.",
      }),
    };

    expect(response).toEqual(expect.objectContaining(expectedResponse));

    await pendingChangesPostalCodeModel.delete({ code: 12345 });
    await usersModel.deleteUser({ id: loginResponse.body.data.id });
  });
});

describe("Contributor Router - PUT  /users/contribution/postal-codes", () => {
  test("Responds with status 201 and message if pending change edit added successfully", async () => {
    await pendingChangesPostalCodeModel.delete({ code: 12345 });
    await postalCodesModel.deleteCode(12345);

    const agent = request.agent(app);
    const loginResponse = await createAndLoginUser(agent);

    await postalCodesModel.createNew("Test", "12345", "BH_POSTA");

    const editedPostalCode = {
      city: "Edited Test",
      code: "12345",
      post: "HP_MOSTAR",
    };

    const response = await agent
      .put("/users/contribution/postal-codes")
      .send(editedPostalCode);
    const expectedResponse = {
      status: 201,
      body: expect.objectContaining({
        message:
          "Postal code edit suggested. Admin will review the suggestion and decide whether to accept it or not.",
      }),
    };

    expect(response).toEqual(expect.objectContaining(expectedResponse));

    await pendingChangesPostalCodeModel.delete({ code: 12345 });
    await usersModel.deleteUser({ id: loginResponse.body.data.id });
  });
});

describe("Contributor Router - DELETE /users/contribution/postal-codes", () => {
  test("Responds with status 200 and message if pending change deletion added successfully", async () => {
    await pendingChangesPostalCodeModel.delete({ code: 12345 });
    await postalCodesModel.deleteCode(12345);

    await postalCodesModel.createNew("Test", 12345, "BH_POSTA");

    const agent = request.agent(app);
    const loginResponse = await createAndLoginUser(agent);

    const response = await agent
      .delete("/users/contribution/postal-codes")
      .send({ code: "12345", city: "Test", post: "BH_POSTA" });
    const expectedResponse = {
      status: 200,
      body: expect.objectContaining({
        message:
          "Postal code deletion suggested. Admin will review the suggestion and decide whether to accept it or not.",
      }),
    };

    expect(response).toEqual(expect.objectContaining(expectedResponse));

    await pendingChangesPostalCodeModel.delete({ code: 12345 });
    await usersModel.deleteUser({ id: loginResponse.body.data.id });
  });
});

describe("Contributor Router - GET /users/contribution/pending-changes/postal-codes", () => {
  test("Responds with status 200 and message if pending changes retrieved successfully", async () => {
    const agent = request.agent(app);
    const loginResponse = await createAndLoginUser(agent);

    const response = await agent.get(
      "/users/contribution/pending-changes/postal-codes",
    );
    const expectedResponse = {
      status: 200,
      body: expect.objectContaining({
        message: "Pending changes retrieved successfully.",
      }),
    };

    expect(response).toEqual(expect.objectContaining(expectedResponse));

    await usersModel.deleteUser({ id: loginResponse.body.data.id });
  });
});

describe("Contributor Router - DELETE /users/contribution/pending-changes/postal-codes", () => {
  test("Responds with status 200 and message if pending change deleted successfully", async () => {
    const agent = request.agent(app);
    const loginResponse = await createAndLoginUser(agent);

    const pendingChange = await pendingChangesPostalCodeModel.create({
      userId: loginResponse.body.data.id,
      code: 12345,
      typeOfChange: "CREATE",
      city: "Test",
      post: "BH_POSTA",
    });

    const response = await agent
      .delete("/users/contribution/pending-changes/postal-codes")
      .send({ id: pendingChange.id });
    const expectedResponse = {
      status: 200,
      body: {
        message: "Pending change deleted successfully.",
        data: null,
      },
    };

    expect(response).toEqual(expect.objectContaining(expectedResponse));

    await usersModel.deleteUser({ id: loginResponse.body.data.id });
  });
});
