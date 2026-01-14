import request from "supertest";
import { describe, test, expect } from "vitest";
import app from "../../app.js";
import createAndLoginUser from "../utils/createUserAndLogin.js";
import createNewUser from "../utils/createNewUser.js";
import { afterEach } from "vitest";
import * as usersModel from "../../models/usersModel.js";

afterEach(async () => {
  await usersModel.deleteAll();
});

describe("authRouter", () => {
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
  });
});

describe("usersRouter", () => {
  test("successfully create a user and returns status 201 and message", async () => {
    const responseData = {
      message: "Registration successful! Check your email.",
    };

    const newUser = createNewUser();

    const response = await request(app).post("/users/signup").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(responseData);
  });

  test("responds with 200 and User test_user logged in successfully for correct input", async () => {
    const newUser = createNewUser();

    const responseData = await createAndLoginUser(newUser);

    const expectedData = {
      message: `User ${newUser.username} logged in successfully`,
      accessToken: "randomstring",
    };

    expect(responseData.status).toBe(200);
    expect(responseData.body.message).toEqual(expectedData.message);

    expect(responseData.body.data).toHaveProperty("accessToken");
  });
});
