import request from "supertest";
import { describe, test, expect } from "vitest";
import app from "../../app.js";
import createAndLoginUser from "../utils/createUserAndLogin.js";
import createNewUserData from "../utils/createNewUser.js";
import { afterEach } from "vitest";
import * as usersModel from "../../models/usersModel.js";

afterEach(async () => {
  await usersModel.deleteAll();
});

describe("authRouter", () => {
  test("responds with status 200 and User is authenticated if logged in", async () => {
    const newUserData = createNewUserData({
      username: "test_user_auth",
      email: "test_user_auth@mail.com",
    });

    const responseData = await createAndLoginUser(newUserData);

    const loggedInResponse = { message: "User is authenticated" };

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", `Token ${responseData.body.data.accessToken}`);

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(loggedInResponse.message);
  });
});

describe("usersRouter", () => {
  test("successfully create a user and returns status 201 and message", async () => {
    const responseData = {
      message: "Registration successful! Check your email.",
    };

    const newUserData = createNewUserData();

    const response = await request(app).post("/users/signup").send(newUserData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(responseData);
  });

  test("responds with 200 and User test_user logged in successfully for correct login input", async () => {
    const newUserData = createNewUserData();

    const response = await createAndLoginUser(newUserData);

    const expectedData = {
      message: `User ${newUserData.username} logged in successfully`,
      accessToken: "randomstring",
    };

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(expectedData.message);

    expect(response.body.data).toHaveProperty("accessToken");
  });

  test("responds User logged out successfully", async () => {
    const newUserData = createNewUserData();
    const responseData = await createAndLoginUser(newUserData);

    const response = await request(app)
      .post("/users/logout")
      .set("Authorization", `Token ${responseData.body.data.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "User logged out successfully",
    });
  });
});
