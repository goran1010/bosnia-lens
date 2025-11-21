import request from "supertest";
import app from "../app.js";
import prisma from "../db/prisma.js";

beforeEach(async () => {
  await prisma.user.deleteMany();
});

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

  test("successfully create a user and returns status 201 and message", async () => {
    const responseData = { message: `User test_user signed up successfully` };

    const requestData = {
      username: "test_user",
      password: "123123",
      confirmPassword: "123123",
    };
    const response = await request(app).post("/users/signup").send(requestData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(responseData);
  });

  test("responds with json 400, Username already taken, if given username exists", async () => {
    const responseData = {
      errors: [
        {
          type: "field",
          value: "test_user",
          msg: "Username already in use",
          path: "username",
          location: "body",
        },
      ],
    };

    await prisma.user.create({
      data: { username: "test_user", password: "123123" },
    });

    const requestData = {
      username: "test_user",
      password: "123123",
      confirmPassword: "123123",
    };
    const response = await request(app).post("/users/signup").send(requestData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(responseData);
  });
});
