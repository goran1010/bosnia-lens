import request from "supertest";
import app from "../../app.js";
import { describe, test, expect } from "vitest";

const dummyData = {
  data: [
    { code: 71000, place: "Sarajevo" },
    { code: 71001, place: "Sarajevo" },
    { code: 78000, place: "Banja Luka" },
  ],
};

describe("GET /status", () => {
  test("responds with status 200 when LIVE", async () => {
    const response = await request(app).get("/api/v1/status");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({
      message: "Server is running",
    });
    expect(response.status).toBe(200);
  });
});

describe("GET /postal-codes", () => {
  test("responds with status 200 and an array with dummy data", async () => {
    const response = await request(app).get("/api/v1/postal-codes");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummyData);
  });
});

describe("GET /postal-codes/:searchTerm", () => {
  test("responds with status 200 and postal codes for /postal-codes/sarajevo", async () => {
    const response = await request(app).get("/api/v1/postal-codes/sarajevo");

    const dummyDataFiltered = dummyData.data.filter(
      (postalCode) => postalCode.place === "Sarajevo",
    );

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(dummyDataFiltered);
  });

  test("responds with status 404 and No postal code found for /postal-codes/non-existent-code", async () => {
    const response = await request(app).get(
      "/api/v1/postal-codes/non-existent-code",
    );

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Postal code not found" });
  });
});
