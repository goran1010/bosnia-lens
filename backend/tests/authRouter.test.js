import request from "supertest";
import { describe, test, expect, vi } from "vitest";
import removeUserFromDB from "./utils/removeUserFromDB.js";
import app from "../app.js";
import axios from "axios";
import createAndLoginUser from "./utils/createUserAndLogin.js";
import createNewUser from "./utils/createNewUser.js";

describe("GET /me", () => {
  test("responds with status 403 and Need to be logged in if not logged in", async () => {
    const notLoggedInResponse = {
      error: "Need to be logged in",
    };

    const response = await request(app).get("/auth/me");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(401);
    expect(response.body).toEqual(notLoggedInResponse);
  });

  test("responds with status 403 and Expired session token in if log in expired", async () => {
    const notLoggedInResponse = {
      error: "Incorrect or expired session token",
    };
    const expiredAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJiZTU4NWUyLTdiOTktNDllMS1iZmE2LWZlODQzY2Y0YWJiNCIsInVzZXJuYW1lIjoibmV3VXNlciIsImlhdCI6MTc2MzY2NTM3NywiZXhwIjoxNzYzNjY2Mjc3fQ.nLmQyXxsvWSR4h6BUOzwy9zPL_JDoEJi57hiwiu5NTc";
    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", `Token ${expiredAccessToken}`);

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual(notLoggedInResponse);
  });

  test("responds with status 200 and User is authenticated if logged in", async () => {
    const newUser = createNewUser({
      username: "test_user_auth",
      email: "test_user_auth@mail.com",
    });

    const responseData = await createAndLoginUser(newUser);

    const loggedInResponse = { message: "User is authenticated" };

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", `Token ${responseData.body.data.accessToken}`);

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(loggedInResponse.message);

    await removeUserFromDB(newUser);
  });
});

describe("GitHub login", () => {
  test("redirects to GitHub OAuth URL", async () => {
    const response = await request(app).get("/auth/github");

    expect(response.status).toBe(302);
    expect(response.header.location).toMatch(
      /^https:\/\/github\.com\/login\/oauth\/authorize\?/,
    );
    expect(response.header.location).toContain("scope=read%3Auser");
    expect(response.header.location).toContain(
      `client_id=${process.env.CLIENT_ID}`,
    );
  });
});

describe("GitHub callback", () => {
  test("github-callback route responds with 302 and redirects if no code is provided", async () => {
    const response = await request(app).get("/auth/github-callback");

    expect(response.status).toBe(302);
    expect(response.header.location).toMatch(/login\?error=no_code/);
  });

  test("github-callback?code= route responds with 302 and /login?error=no_token if no_access token", async () => {
    const validCode = "valid_code";

    const mockPost = vi.spyOn(axios, "post").mockResolvedValue({
      data: {},
    });

    const response = await request(app).get(
      `/auth/github-callback?code=${validCode}`,
    );

    expect(response.status).toBe(302);
    expect(response.header.location).toMatch(/login\?error=no_token/i);

    mockPost.mockRestore();
  });

  test("github-callback?code= route responds with 200 and tokens if valid code is provided", async () => {
    const validCode = "valid_code";

    const mockPost = vi.spyOn(axios, "post").mockResolvedValue({
      data: { access_token: "mock_github_access_token" },
    });
    const mockGet = vi.spyOn(axios, "get").mockResolvedValue({
      data: { email: "test@example.com", login: "testuser" },
    });

    const response = await request(app).get(
      `/auth/github-callback?code=${validCode}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    mockPost.mockRestore();
    mockGet.mockRestore();
  });
});
