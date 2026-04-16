import { describe, test, expect } from "vitest";
import request from "supertest";

describe("app", () => {
  test("app should be defined", async () => {
    const { app } = await import("../app.js");
    expect(app).toBeDefined();
  });

  test("app responds with status 500 if an unexpected error occurs", async () => {
    const { app } = await import("../app.js");

    const response = await request(app).get("/");

    expect(response.body).toEqual({
      error: {
        message: "Server error: please try again later.",
      },
    });
    expect(response.status).toBe(500);
  });
});
