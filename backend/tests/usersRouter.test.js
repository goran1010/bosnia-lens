import request from "supertest";
import app from "../app.js";

describe("POST /signup", () => {
  test("responds with status 400 and message for incorrect form input", async () => {
    const responseData = {
      errors: [
        {
          type: "field",
          value: "ne",
          msg: "Username must be at least 4 characters long",
          path: "username",
          location: "body",
        },
      ],
    };
    const requestData = {
      username: "ne",
      password: "123123",
      confirmPassword: "123123",
    };
    const response = await request(app).post("/users/signup").send(requestData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(responseData);
  });
});
