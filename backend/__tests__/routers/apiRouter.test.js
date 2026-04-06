import request from "supertest";
import { app } from "../../app.js";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { postalCodesModel } from "../../models/postalCodesModel.js";

beforeEach(() => {
  vi.clearAllMocks();
});

const dummyData = {
  data: [
    { code: 71000, city: "Sarajevo" },
    { code: 71001, city: "Sarajevo" },
    { code: 78000, city: "Banja Luka" },
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

describe("GET /api/", () => {
  test("responds with status 200 when LIVE", async () => {
    const response = await request(app).get("/api/");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({
      message: "API server is running",
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
