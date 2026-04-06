import request from "supertest";
import { app } from "../../app.js";
import { describe, test, expect } from "vitest";

describe("CSRF Router", () => {
  test("should return a CSRF token", async () => {
    const response = await request(app).get("/csrf-token");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("string");
  });
});
