import request from "supertest";
import { describe, test, expect } from "vitest";
import prisma from "../db/prisma.js";
import app from "../app.js";

async function createAndLoginUser(newUser) {
  const createUserData = {
    username: newUser.username,
    password: "123123",
    email: newUser.email,
    ["confirm-password"]: "123123",
  };
  await request(app).post("/users/signup").send(createUserData);

  await prisma.user.update({
    where: { username: createUserData.username },
    data: { isEmailConfirmed: true },
  });

  const requestData = {
    username: createUserData.username,
    password: "123123",
  };
  const responseData = await request(app)
    .post("/users/login")
    .send(requestData);

  return responseData;
}

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
    const newUser = {
      username: "test_user_me",
      email: "example_me@mail.com",
    };

    const responseData = await createAndLoginUser(newUser);

    const loggedInResponse = { message: "User is authenticated" };

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", `Token ${responseData.body.data.accessToken}`);

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(loggedInResponse.message);

    await prisma.user.delete({ where: { username: newUser.username } });
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

  test("GitHub callback");
});
