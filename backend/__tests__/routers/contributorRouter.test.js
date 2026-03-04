import request from "supertest";
import { describe, test, expect, vi } from "vitest";
import jwt from "jsonwebtoken";
import { createNewUser } from "../utils/createNewUser.js";
import { createContributorAndKeepLoggedIn } from "../utils/createContributorAndKeepLoggedIn.js";
import * as usersModel from "../../models/usersModel.js";
import * as postalCodesModel from "../../models/postalCodesModel.js";
import { app } from "../../app.js";

vi.mock("csrf-sync", () => {
  const originalModule = vi.importActual("csrf-sync");
  return {
    ...originalModule,
    csrfSync: () => {
      return {
        csrfSynchronisedProtection: (req, res, next) => {
          next();
        },
      };
    },
  };
});

describe("POST /users/contributor/postal-codes", () => {
  test("responds with status 401 and You need to be logged in to access this route if not logged in", async () => {
    const notLoggedInResponse = {
      error: "You are not logged in.",
      details: [{ msg: null }],
    };

    const response = await request(app).post("/users/contributor/postal-codes");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(401);
    expect(response.body).toEqual(notLoggedInResponse);
  });

  test("responds with status 403 and You need to be a contributor to access this route if logged in but not a contributor", async () => {
    const newUserData = createNewUser();

    await usersModel.deleteUser({ email: newUserData.email });

    const agent = request.agent(app);

    await agent.post("/auth/signup").send(newUserData);

    const accessToken = jwt.sign(
      { email: newUserData.email, username: newUserData.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    await agent.get(`/auth/confirm/${accessToken}`);

    const response = await agent.post("/auth/login").send({
      username: newUserData.username,
      password: newUserData.password,
    });

    const expectedResponse = {
      error: "You need to be a contributor to access this route.",
      details: [{ msg: null }],
    };

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(`Logged in successfully`);

    const adminRouteResponse = await agent.post(
      "/users/contributor/postal-codes",
    );

    expect(adminRouteResponse.header["content-type"]).toMatch(/json/);
    expect(adminRouteResponse.body).toEqual(expectedResponse);
    expect(adminRouteResponse.status).toBe(403);
  });

  test("No code sent responds with status 400 and Code is required", async () => {
    const agent = request.agent(app);

    const newUserData = createNewUser();

    await usersModel.deleteUser({
      username: newUserData.username,
    });

    const response = await createContributorAndKeepLoggedIn(agent, newUserData);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(`Logged in successfully`);

    const expectedResponse = "Validation failed";
    const responseCode = await agent.post("/users/contributor/postal-codes");

    expect(responseCode.header["content-type"]).toMatch(/json/);
    expect(responseCode.status).toBe(400);
    expect(responseCode.body.error).toBe(expectedResponse);
  });

  test("Responds with status 400 and Postal codes must have 5 numbers if code sent is not 5 numbers", async () => {
    const agent = request.agent(app);

    const newUserData = createNewUser({ isContributor: true });

    await usersModel.deleteUser({ email: newUserData.email });

    const response = await createContributorAndKeepLoggedIn(agent, newUserData);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(`Logged in successfully`);

    const expectedResponse = "Validation failed";
    const responseCode = await agent
      .post("/users/contributor/postal-codes")
      .query({ city: "TestCity", code: "1234", post: "" });

    expect(responseCode.header["content-type"]).toMatch(/json/);
    expect(responseCode.status).toBe(400);
    expect(responseCode.body.error).toBe(expectedResponse);
  });

  test("Responds with status 400 and Must be a number if code sent is not a number", async () => {
    const agent = request.agent(app);

    const newUserData = createNewUser({ isContributor: true });

    await usersModel.deleteUser({ email: newUserData.email });

    const response = await createContributorAndKeepLoggedIn(agent, newUserData);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(`Logged in successfully`);

    const expectedResponse = "Validation failed";
    const responseCode = await agent
      .post("/users/contributor/postal-codes")
      .query({ city: "TestCity", code: "abcde", post: "" });

    expect(responseCode.header["content-type"]).toMatch(/json/);
    expect(responseCode.status).toBe(400);
    expect(responseCode.body.error).toBe(expectedResponse);
  });

  test("Responds with status 400 and Code already exists if code sent already exists in database", async () => {
    const agent = request.agent(app);

    const newUserData = createNewUser({ isContributor: true });

    await usersModel.deleteUser({ email: newUserData.email });

    const response = await createContributorAndKeepLoggedIn(agent, newUserData);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(`Logged in successfully`);

    vi.spyOn(postalCodesModel, "getPostalCodeByCode").mockResolvedValue({
      city: "TestCity",
      code: "12345",
      post: "",
    });

    const expectedResponse = "Validation failed";
    const responseCode = await agent
      .post("/users/contributor/postal-codes")
      .query({ city: "TestCity", code: "12345", post: "" });

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

    vi.spyOn(postalCodesModel, "getPostalCodeByCode").mockResolvedValue(null);

    const agent = request.agent(app);

    const newUserData = createNewUser({ isContributor: true });

    await usersModel.deleteUser({ email: newUserData.email });

    const response = await createContributorAndKeepLoggedIn(agent, newUserData);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(`Logged in successfully`);

    const expectedResponse = {
      message: "New postal code row created.",
      data: { city: "TestCity", code: "12345", post: "" },
    };

    const responseCode = await agent
      .post("/users/contributor/postal-codes")
      .query({ city: "TestCity", code: "12345", post: "" });

    expect(responseCode.header["content-type"]).toMatch(/json/);
    // expect(responseCode.status).toBe(201);
    expect(responseCode.body).toEqual(expectedResponse);
  });
});

describe("PUT /users/contributor/postal-codes", () => {
  test("responds with status 401 and You need to be logged in to access this route if not logged in", async () => {
    const notLoggedInResponse = {
      error: "You are not logged in.",
      details: [{ msg: null }],
    };

    const response = await request(app).put("/users/contributor/postal-codes");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(401);
    expect(response.body).toEqual(notLoggedInResponse);
  });

  test("responds with status 403 and You need to be a contributor to access this route if logged in but not a contributor", async () => {
    const newUserData = createNewUser();

    await usersModel.deleteUser({ email: newUserData.email });

    const agent = request.agent(app);

    await agent.post("/auth/signup").send(newUserData);
    const accessToken = jwt.sign(
      { email: newUserData.email, username: newUserData.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );
    await agent.get(`/auth/confirm/${accessToken}`);
    const response = await agent.post("/auth/login").send({
      username: newUserData.username,
      password: newUserData.password,
    });

    const expectedResponse = {
      error: "You need to be a contributor to access this route.",
      details: [{ msg: null }],
    };

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(`Logged in successfully`);

    const adminRouteResponse = await agent.put(
      "/users/contributor/postal-codes",
    );

    expect(adminRouteResponse.header["content-type"]).toMatch(/json/);
    expect(adminRouteResponse.status).toBe(403);
    expect(adminRouteResponse.body).toEqual(expectedResponse);
  });

  test("No code sent responds with status 400 and Code is required", async () => {
    const agent = request.agent(app);

    const newUserData = createNewUser({ isContributor: true });

    await usersModel.deleteUser({ email: newUserData.email });

    const response = await createContributorAndKeepLoggedIn(agent, newUserData);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(`Logged in successfully`);

    const expectedResponse = "Validation failed";
    const responseCode = await agent.put("/users/contributor/postal-codes");

    expect(responseCode.header["content-type"]).toMatch(/json/);
    expect(responseCode.status).toBe(400);
    expect(responseCode.body.error).toBe(expectedResponse);
  });

  test("Valid request responds with status 200 and Postal code row edited", async () => {
    vi.spyOn(postalCodesModel, "edit").mockResolvedValue({
      city: "TestCity",
      code: "12345",
      post: "",
    });

    vi.spyOn(postalCodesModel, "getPostalCodeByCode").mockResolvedValue({
      city: "TestCity",
      code: "12345",
      post: "",
    });

    const agent = request.agent(app);
    const newUserData = createNewUser({ isContributor: true });

    await usersModel.deleteUser({ email: newUserData.email });

    const response = await createContributorAndKeepLoggedIn(agent, newUserData);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(`Logged in successfully`);

    const expectedResponse = {
      message: "Postal code row edited.",
      data: { city: "TestCity", code: "12345", post: "" },
    };

    const responseCode = await agent
      .put("/users/contributor/postal-codes")
      .query({ city: "TestCity", code: "12345", post: "" });

    expect(responseCode.header["content-type"]).toMatch(/json/);
    expect(responseCode.status).toBe(201);
    expect(responseCode.body).toEqual(expectedResponse);
  });
});

describe("DELETE /users/contributor/postal-codes", () => {
  test("responds with status 401 and You need to be logged in to access this route if not logged in", async () => {
    const notLoggedInResponse = {
      error: "You are not logged in.",
      details: [{ msg: null }],
    };

    const response = await request(app).delete(
      "/users/contributor/postal-codes",
    );

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(401);
    expect(response.body).toEqual(notLoggedInResponse);
  });

  test("responds with status 403 and You need to be a contributor to access this route if logged in but not a contributor", async () => {
    const newUserData = createNewUser();

    await usersModel.deleteUser({ email: newUserData.email });

    const agent = request.agent(app);

    await agent.post("/auth/signup").send(newUserData);
    const accessToken = jwt.sign(
      { email: newUserData.email, username: newUserData.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );
    await agent.get(`/auth/confirm/${accessToken}`);
    const response = await agent.post("/auth/login").send({
      username: newUserData.username,
      password: newUserData.password,
    });

    const expectedResponse = {
      error: "You need to be a contributor to access this route.",
      details: [{ msg: null }],
    };

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(`Logged in successfully`);

    const adminRouteResponse = await agent.delete(
      "/users/contributor/postal-codes",
    );

    expect(adminRouteResponse.header["content-type"]).toMatch(/json/);
    expect(adminRouteResponse.status).toBe(403);
    expect(adminRouteResponse.body).toEqual(expectedResponse);
  });

  test("No code sent responds with status 400 and Code is required", async () => {
    const agent = request.agent(app);

    const newUserData = createNewUser({ isContributor: true });

    await usersModel.deleteUser({ email: newUserData.email });

    const response = await createContributorAndKeepLoggedIn(agent, newUserData);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(`Logged in successfully`);

    const expectedResponse = "Validation failed";
    const responseCode = await agent.delete("/users/contributor/postal-codes");

    expect(responseCode.header["content-type"]).toMatch(/json/);
    expect(responseCode.status).toBe(400);
    expect(responseCode.body.error).toBe(expectedResponse);
  });

  test("Valid request responds with status 200 and Postal code row deleted", async () => {
    vi.spyOn(postalCodesModel, "deleteCode").mockResolvedValue({
      city: "TestCity",
      code: "12345",
      post: "",
    });

    const agent = request.agent(app);
    const newUserData = createNewUser({ isContributor: true });
    await usersModel.deleteUser({ email: newUserData.email });

    const response = await createContributorAndKeepLoggedIn(agent, newUserData);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(`Logged in successfully`);

    const expectedResponse = {
      message: "Postal code row deleted.",
      data: { city: "TestCity", code: "12345", post: "" },
    };

    const responseCode = await agent
      .delete("/users/contributor/postal-codes")
      .query({ code: "12345" });

    expect(responseCode.header["content-type"]).toMatch(/json/);
    expect(responseCode.status).toBe(200);
    expect(responseCode.body).toEqual(expectedResponse);
  });
});
