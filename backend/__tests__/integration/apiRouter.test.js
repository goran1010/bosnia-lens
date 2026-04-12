import request from "supertest";
import { app } from "../../app.js";
import { describe, test, expect } from "vitest";

describe("GET /api/", () => {
  test("responds with status 200 when LIVE", async () => {
    const response = await request(app).get("/api/");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({
      data: {
        status: "ok",
      },
      message: "API server is running",
    });
    expect(response.status).toBe(200);
  });
});
