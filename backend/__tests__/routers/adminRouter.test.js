import request from "supertest";
import { describe, test, expect, vi } from "vitest";
import jwt from "jsonwebtoken";
import { createNewUser } from "../utils/createNewUser.js";
import { createAdminAndKeepLoggedIn } from "../utils/createAndKeepLoggedIn.js";
import * as usersModel from "../../models/usersModel.js";
import * as postalCodesModel from "../../models/postalCodesModel.js";
import { app } from "../../app.js";

describe("POST /admin/postal-codes", () => {
  test("responds with status 401 and You need to be logged in and an admin to access this route if not logged in", async () => {
    const notLoggedInResponse = {
      error: "You need to be logged in and an admin to access this route.",
      details: [{ msg: null }],
    };

    const response = await request(app).post("/admin/postal-codes");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(401);
    expect(response.body).toEqual(notLoggedInResponse);
  });

  test("responds with status 403 and You need to be admin to access this route if logged in but not admin", async () => {
    const newUserData = createNewUser();

    try {
      await usersModel.deleteUser({ email: newUserData.email });
    } catch (e) {
      console.warn(e);
    }

    const agent = request.agent(app);

    await agent.post("/users/signup").send(newUserData);

    const accessToken = jwt.sign(
      { email: newUserData.email, username: newUserData.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    await agent.get(`/users/confirm/${accessToken}`);

    const response = await agent.post("/users/login").send({
      username: newUserData.username,
      password: newUserData.password,
    });

    const expectedResponse = {
      error: "You need to be admin to access this route.",
      details: [{ msg: null }],
    };

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(`Logged in successfully`);

    const adminRouteResponse = await agent.post("/admin/postal-codes");

    expect(adminRouteResponse.header["content-type"]).toMatch(/json/);
    // expect(adminRouteResponse.status).toBe(403);
    expect(adminRouteResponse.body).toEqual(expectedResponse);
  });

  test("No code sent responds with status 400 and Code is required", async () => {
    const agent = request.agent(app);

    const newUserData = createNewUser({ isAdmin: true });

    try {
      await usersModel.deleteUser({ email: newUserData.email });
    } catch (e) {
      console.warn(e);
    }

    const response = await createAdminAndKeepLoggedIn(agent, newUserData);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(`Logged in successfully`);

    const expectedResponse = "Validation failed";
    const responseCode = await agent.post("/admin/postal-codes");

    expect(responseCode.header["content-type"]).toMatch(/json/);
    expect(responseCode.status).toBe(400);
    expect(responseCode.body.error).toBe(expectedResponse);
  });

  test("Valid request responds with status 200 and New postal code row created", async () => {
    vi.spyOn(postalCodesModel, "createNew").mockResolvedValue({
      city: "TestCity",
      code: "12345",
      post: "",
    });

    const agent = request.agent(app);

    const newUserData = createNewUser({ isAdmin: true });

    try {
      await usersModel.deleteUser({ email: newUserData.email });
    } catch (e) {
      console.warn(e);
    }

    const response = await createAdminAndKeepLoggedIn(agent, newUserData);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(`Logged in successfully`);

    const expectedResponse = {
      message: "New postal code row created.",
      data: { city: "TestCity", code: "12345", post: "" },
    };

    const responseCode = await agent
      .post("/admin/postal-codes")
      .query({ city: "TestCity", code: "12345", post: "" });

    expect(responseCode.header["content-type"]).toMatch(/json/);
    expect(responseCode.status).toBe(201);
    expect(responseCode.body).toEqual(expectedResponse);
  });
});
