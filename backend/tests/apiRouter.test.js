import request from "supertest";
import app from "../app.js";

describe("GET /status", () => {
  test("responds with status 200 when LIVE", async () => {
    const response = await request(app).get("/api/v1/status");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toBe(200);
  });
});

describe("GET /postal-codes", () => {
  const dummyData = [
    {
      code: 71000,
      place: "Sarajevo",
    },
    {
      code: 78000,
      place: "Banja Luka",
    },
  ];

  test("responds with status 200 and an array with dummy data", async () => {
    const response = await request(app).get("/api/v1/postal-codes");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummyData);
  });
});

describe("GET /postal-codes/:searchTerm", () => {
  test("responds with status 200 and postal codes for /postal-codes/sarajevo", async () => {
    const dummyData = [
      {
        code: 71000,
        place: "Sarajevo",
      },
      {
        code: 71001,
        place: "Sarajevo",
      },
    ];

    const response = await request(app).get("/api/v1/postal-codes/sarajevo");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummyData);
  });

  test("responds with status 404 and No postal code found for /postal-codes/asdfasdf", async () => {
    const dummyData = {
      error: "Postal code not found",
    };

    const response = await request(app).get("/api/v1/postal-codes/asdfasdf");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toBe(404);
    expect(response.body).toEqual(dummyData);
  });
});
