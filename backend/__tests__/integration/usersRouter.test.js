import request from "supertest";
import { describe, test, expect, vi } from "vitest";
import { app } from "../../app.js";
import { createAndLoginUser } from "../utils/createUserAndLogin.js";
import { createNewUser } from "../utils/createNewUser.js";
import { usersModel } from "../../models/usersModel.js";
import jwt from "jsonwebtoken";
import { emailConfirmHTML } from "../../utils/emailConfirmHTML.js";

vi.mock("../../email/confirmationEmail.js", () => ({
  sendConfirmationEmail: vi.fn(async () => {
    return { success: true };
  }),
}));

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

describe("usersRouter", () => {
  test("successfully create a user and returns status 201 and message", async () => {
    const responseData = {
      message: "Registration successful! Check your email.",
    };

    const newUserData = createNewUser();

    const response = await request(app).post("/auth/signup").send(newUserData);

    expect(response.body).toEqual(responseData);
    expect(response.status).toBe(201);
  });

  test("responds with 200 and User test_user logged in successfully for correct login input", async () => {
    const agent = request.agent(app);
    const newUserData = createNewUser();

    const response = await createAndLoginUser(agent, newUserData);

    const expectedData = {
      message: `Logged in successfully`,
    };

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(expectedData.message);
  });

  test("responds User logged out successfully", async () => {
    const agent = request.agent(app);
    const userData = createNewUser();
    await createAndLoginUser(agent, userData);

    const response = await agent.post("/users/logout");

    expect(response.body).toEqual({
      message: "User logged out successfully",
    });
    expect(response.status).toBe(200);
  });

  test("responds with status 200 and HTML for valid token", async () => {
    const { username, password, email } = createNewUser();
    const userInDB = await usersModel.create({
      username,
      password,
      email,
    });

    const accessToken = jwt.sign(
      { email: userInDB.email, username: userInDB.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30d" },
    );

    const response = await request(app).get(`/auth/confirm/${accessToken}`);

    expect(response.text).toContain(emailConfirmHTML());
    expect(response.status).toBe(200);
  });
});
