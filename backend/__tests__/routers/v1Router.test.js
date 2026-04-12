import request from "supertest";
import { app } from "../../app.js";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { postalCodesModel } from "../../models/postalCodesModel.js";

beforeEach(() => {
  vi.clearAllMocks();
});

const dummyData = {
  data: [
    { code: 71000, city: "Sarajevo", post: "BH_POSTA" },
    { code: 71001, city: "Sarajevo", post: "BH_POSTA" },
    { code: 78000, city: "Banja Luka", post: "POSTE_SRP" },
  ],
};

vi.spyOn(postalCodesModel, "getAllPostalCodes").mockResolvedValue(
  dummyData.data,
);
vi.spyOn(postalCodesModel, "getPostalCodesByCity").mockImplementation(
  async (city) => {
    return dummyData.data.filter(
      (postalCode) => postalCode.city.toLowerCase() === city.toLowerCase(),
    );
  },
);
vi.spyOn(postalCodesModel, "getPostalCodeByCode").mockImplementation(
  async (code) => {
    return (
      dummyData.data.find((postalCode) => postalCode.code === code) || null
    );
  },
);

describe("GET /", () => {
  test("responds with status 200 when LIVE", async () => {
    const response = await request(app).get("/api/v1/");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({
      message: "API v1 server is running",
    });
    expect(response.status).toBe(200);
  });
});

describe("GET /api/v1/postal-codes", () => {
  test("responds with status 200 and an array with dummy data", async () => {
    const response = await request(app).get("/api/v1/postal-codes");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({
      message: "Postal codes retrieved successfully",
      data: dummyData.data,
    });
    expect(response.status).toBe(200);
  });
});

describe("GET /api/v1/postal-codes/search", () => {
  test("responds with status 200 and postal codes for /api/v1/postal-codes/search?searchTerm=sarajevo", async () => {
    const response = await request(app).get(
      "/api/v1/postal-codes/search?searchTerm=sarajevo",
    );

    const dummyDataFiltered = dummyData.data.filter(
      (postalCode) => postalCode.city === "Sarajevo",
    );

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.data).toEqual(dummyDataFiltered);
    expect(response.status).toBe(200);
  });

  test("responds with status 200 and postal code for /postal-codes/search?searchTerm=71000", async () => {
    const response = await request(app).get(
      "/api/v1/postal-codes/search?searchTerm=71000",
    );

    const dummyDataFiltered = [
      dummyData.data.find((postalCode) => postalCode.code === 71000),
    ];

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.data).toEqual(dummyDataFiltered);
    expect(response.status).toBe(200);
  });

  test("responds with status 404 and No postal code found for /postal-codes/search?searchTerm=non-existent-code", async () => {
    const response = await request(app).get(
      "/api/v1/postal-codes/search?searchTerm=non-existent-code",
    );

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({
      error: "Postal code not found",
      details: [{ msg: null }],
    });
    expect(response.status).toBe(404);
  });

  test("responds with status 400 and error message for missing searchTerm", async () => {
    const response = await request(app).get("/api/v1/postal-codes/search");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.error).toEqual("Validation failed");
    expect(response.body.details[0].msg).toEqual("Search term is required");
    expect(response.status).toBe(400);
  });
});
