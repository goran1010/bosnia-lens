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
    const expectedResponse = {
      status: 200,
      body: {
        data: {
          status: "ok",
        },
        message: "API v1 server is running",
      },
    };

    expect(response).toEqual(expect.objectContaining(expectedResponse));
  });
});

describe("GET /api/v1/postal-codes", () => {
  test("responds with status 200 and an array with dummy data", async () => {
    const response = await request(app).get("/api/v1/postal-codes");
    const expectedResponse = {
      status: 200,
      body: {
        message: "Postal codes retrieved successfully",
        data: dummyData.data,
      },
    };

    expect(response).toEqual(expect.objectContaining(expectedResponse));
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
    const expectedResponse = {
      status: 200,
      body: expect.objectContaining({
        data: dummyDataFiltered,
      }),
    };

    expect(response).toEqual(expect.objectContaining(expectedResponse));
  });

  test("responds with status 200 and postal code for /postal-codes/search?searchTerm=71000", async () => {
    const response = await request(app).get(
      "/api/v1/postal-codes/search?searchTerm=71000",
    );

    const dummyDataFiltered = [
      dummyData.data.find((postalCode) => postalCode.code === 71000),
    ];
    const expectedResponse = {
      status: 200,
      body: expect.objectContaining({
        data: dummyDataFiltered,
      }),
    };

    expect(response).toEqual(expect.objectContaining(expectedResponse));
  });

  test("responds with status 404 and No postal code found for /postal-codes/search?searchTerm=non-existent-code", async () => {
    const response = await request(app).get(
      "/api/v1/postal-codes/search?searchTerm=non-existent-code",
    );
    const expectedResponse = {
      status: 404,
      body: {
        error: {
          message:
            "Postal code not found: verify the search term and try again.",
        },
      },
    };

    expect(response).toEqual(expect.objectContaining(expectedResponse));
  });

  test("responds with status 400 and error message for missing searchTerm", async () => {
    const response = await request(app).get("/api/v1/postal-codes/search");
    const expectedResponse = {
      status: 400,
      body: expect.objectContaining({
        error: expect.objectContaining({
          message: expect.stringContaining("Search term is required"),
        }),
      }),
    };

    expect(response).toEqual(expect.objectContaining(expectedResponse));
  });
});
