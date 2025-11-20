import request from "supertest";
import app from "../app.js";

describe("GET /check-auth", () => {
  test("responds with status 401 and Need to be logged in if not logged in", async () => {
    const notLoggedInResponse = {
      errors: [
        {
          msg: "Need to be logged in",
        },
      ],
    };

    const response = await request(app).get("/auth/check-auth");

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(401);
    expect(response.body).toEqual(notLoggedInResponse);
  });

  test("responds with status 401 and Need to be logged in if not logged in", async () => {
    
  });
});
