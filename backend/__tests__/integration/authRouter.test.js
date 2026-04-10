import request from "supertest";
import { describe, test, expect } from "vitest";
import { app } from "../../app.js";
import { createAndLoginUser } from "../utils/createUserAndLogin.js";
import { createNewUser } from "../utils/createNewUser.js";

describe("authRouter", () => {
  test("responds with status 200 and user data if logged in", async () => {
    const agent = request.agent(app);
    const userData = createNewUser();
    await createAndLoginUser(agent, userData);

    const response = await agent.get("/users/me");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        username: userData.username,
        email: userData.email,
      }),
    );
    expect(response.status).toBe(200);
  });
});
