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

  test("responds with status 403 and Expired session token in if log in expired", async () => {
    const notLoggedInResponse = {
      errors: [
        {
          msg: "Expired session token",
        },
      ],
    };
    const expiredAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJiZTU4NWUyLTdiOTktNDllMS1iZmE2LWZlODQzY2Y0YWJiNCIsInVzZXJuYW1lIjoibmV3VXNlciIsImlhdCI6MTc2MzY2NTM3NywiZXhwIjoxNzYzNjY2Mjc3fQ.nLmQyXxsvWSR4h6BUOzwy9zPL_JDoEJi57hiwiu5NTc";
    const response = await request(app)
      .get("/auth/check-auth")
      .set("Authorization", `Token ${expiredAccessToken}`);

    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toEqual(notLoggedInResponse);
  });
});
