import request from "supertest";
import { describe, test, expect } from "vitest";
import jwt from "jsonwebtoken";
import { createNewUser } from "../utils/createNewUser.js";

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
    const agent = request.agent(app);

    const newUserData = createNewUser();

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
    expect(adminRouteResponse.status).toBe(403);
    expect(adminRouteResponse.body).toEqual(expectedResponse);
  });

  test("");
});
