import request from "supertest";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { postalCodesModel } from "../../models/postalCodesModel.js";
import { app } from "../../app.js";
import { pendingChangesPostalCodeModel } from "../../models/pendingChangesPostalCodeModel.js";

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

describe("POST /users/contribution/postal-codes", () => {
  test("responds with status 401 and You need to be logged in to access this route if not logged in", async () => {
    const notLoggedInResponse = {
      error: "You are not logged in.",
      details: [{ msg: null }],
    };

    const response = await request(app).post(
      "/users/contribution/postal-codes",
    );

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual(notLoggedInResponse);
    expect(response.status).toBe(401);
  });

  test("No code sent responds with status 400 and Code is required", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
    };
    const agent = request.agent(app);

    const expectedResponse = "Validation failed: code: Code is required";
    const response = await agent.post("/users/contribution/postal-codes");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body.error.message).toContain(expectedResponse);
    expect(response.status).toBe(400);
  });

  test("Responds with status 400 and Postal codes must have 5 numbers if code sent is not 5 numbers", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
    };
    const agent = request.agent(app);

    const expectedResponse = "Postal codes must have 5 numbers";
    const responseCode = await agent
      .post("/users/contribution/postal-codes")
      .send({ city: "TestCity", code: "1234", post: "" });

    expect(responseCode.header["content-type"]).toMatch(/json/);
    expect(responseCode.body.error.message).toContain(expectedResponse);
    expect(responseCode.status).toBe(400);
  });

  test("Responds with status 400 and Must be a number if code sent is not a number", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
    };
    const agent = request.agent(app);

    const expectedResponse = "Must be a number";
    const responseCode = await agent
      .post("/users/contribution/postal-codes")
      .send({ city: "TestCity", code: "abcde", post: "" });

    expect(responseCode.header["content-type"]).toMatch(/json/);
    expect(responseCode.body.error.message).toContain(expectedResponse);
    expect(responseCode.status).toBe(400);
  });

  test("Valid request responds with status 201 and New postal code row created", async () => {
    vi.spyOn(pendingChangesPostalCodeModel, "create").mockResolvedValue({
      city: "TestCity",
      code: "12345",
      post: "",
    });

    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
    };

    const agent = request.agent(app);

    const expectedResponse = {
      message:
        "New postal code suggested. Admin will review the suggestion and decide whether to accept it or not.",
      data: { city: "TestCity", code: "12345", post: "" },
    };

    const response = await agent
      .post("/users/contribution/postal-codes")
      .send({ city: "TestCity", code: "12345", post: "" });

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual(expectedResponse);
    expect(response.status).toBe(201);
  });
});

describe("PUT /users/contribution/postal-codes", () => {
  test("responds with status 401 and You need to be logged in to access this route if not logged in", async () => {
    const notLoggedInResponse = {
      error: "You are not logged in.",
      details: [{ msg: null }],
    };

    const response = await request(app).put("/users/contribution/postal-codes");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual(notLoggedInResponse);
    expect(response.status).toBe(401);
  });

  test("No code sent responds with status 400 and Code is required", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
    };
    const agent = request.agent(app);

    const expectedResponse = "Code is required";
    const responseCode = await agent.put("/users/contribution/postal-codes");

    expect(responseCode.header["content-type"]).toMatch(/json/);
    expect(responseCode.body.error.message).toContain(expectedResponse);
    expect(responseCode.status).toBe(400);
  });

  test("Valid request responds with status 201 and Postal code edit suggested", async () => {
    vi.spyOn(pendingChangesPostalCodeModel, "create").mockResolvedValue({
      city: "TestCity",
      code: "12345",
      post: "",
    });

    vi.spyOn(postalCodesModel, "getPostalCodeByCode").mockResolvedValue({
      city: "TestCity",
      code: "12345",
      post: "",
    });

    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
    };
    const agent = request.agent(app);

    const expectedResponse = {
      message:
        "Postal code edit suggested. Admin will review the suggestion and decide whether to accept it or not.",
      data: { city: "TestCity", code: "12345", post: "" },
    };

    const response = await agent
      .put("/users/contribution/postal-codes")
      .send({ city: "TestCity", code: "12345", post: "" });

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual(expectedResponse);
    expect(response.status).toBe(201);
  });
});

describe("DELETE /users/contribution/postal-codes", () => {
  test("responds with status 401 and You need to be logged in to access this route if not logged in", async () => {
    const notLoggedInResponse = {
      error: "You are not logged in.",
      details: [{ msg: null }],
    };

    const response = await request(app).delete(
      "/users/contribution/postal-codes",
    );

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual(notLoggedInResponse);
    expect(response.status).toBe(401);
  });

  test("No code sent responds with status 400 and Code is required", async () => {
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
    };
    const agent = request.agent(app);

    const expectedResponse = "Code is required";
    const responseCode = await agent.delete("/users/contribution/postal-codes");

    expect(responseCode.header["content-type"]).toMatch(/json/);
    expect(responseCode.body.error.message).toContain(expectedResponse);
    expect(responseCode.status).toBe(400);
  });

  test("Valid request responds with status 200 and Postal code row deleted", async () => {
    vi.spyOn(pendingChangesPostalCodeModel, "create").mockResolvedValue({
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
    mockedUser = {
      id: 1,
      username: "user1",
      email: "user1@example.com",
    };

    const expectedResponse = {
      message:
        "Postal code deletion suggested. Admin will review the suggestion and decide whether to accept it or not.",
      data: { city: "TestCity", code: "12345", post: "" },
    };

    const responseCode = await agent
      .delete("/users/contribution/postal-codes")
      .send({ code: "12345" });

    expect(responseCode.header["content-type"]).toMatch(/json/);
    expect(responseCode.body).toEqual(expectedResponse);
    expect(responseCode.status).toBe(200);
  });
});
