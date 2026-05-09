import request from "supertest";
import { app } from "../../app.js";
import { describe, test, expect } from "vitest";
import { postalCodesModel } from "../../models/postalCodesModel.js";

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
  test("responds with status 200 and postal codes", async () => {
    const postalCode = { city: "Test", code: "12345", post: "BH_POSTA" };
    await postalCodesModel.deleteCode(postalCode.code);

    const codeInDb = await postalCodesModel.createNew(
      postalCode.city,
      postalCode.code,
      postalCode.post,
    );

    const response = await request(app).get("/api/v1/postal-codes");
    const expectedResponse = {
      status: 200,
      body: {
        message: "Postal codes retrieved successfully",
        data: expect.arrayContaining([
          expect.objectContaining({
            city: codeInDb.city,
            code: codeInDb.code,
            post: codeInDb.post,
          }),
        ]),
      },
    };

    expect(response).toEqual(expect.objectContaining(expectedResponse));
    await postalCodesModel.deleteCode(postalCode.code);
  });
});

describe("GET /api/v1/postal-codes/search", () => {
  test("responds with status 200 and postal codes for searchTerm=Sarajevo", async () => {
    const postalCode = { city: "Sarajevo", code: "12345", post: "BH_POSTA" };
    await postalCodesModel.deleteCode(postalCode.code);

    const codeInDb = await postalCodesModel.createNew(
      postalCode.city,
      postalCode.code,
      postalCode.post,
    );

    const response = await request(app).get(
      "/api/v1/postal-codes/search?searchTerm=Sarajevo",
    );
    const expectedResponse = {
      status: 200,
      body: expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            city: codeInDb.city,
            code: codeInDb.code,
            post: codeInDb.post,
          }),
        ]),
      }),
    };
    expect(response).toEqual(expect.objectContaining(expectedResponse));

    await postalCodesModel.deleteCode(postalCode.code);
  });

  test("responds with status 200 and postal code for searchTerm=71000", async () => {
    const postalCode = { city: "Test", code: "71000", post: "BH_POSTA" };
    await postalCodesModel.deleteCode(postalCode.code);

    const codeInDb = await postalCodesModel.createNew(
      postalCode.city,
      postalCode.code,
      postalCode.post,
    );

    const response = await request(app).get(
      "/api/v1/postal-codes/search?searchTerm=71000",
    );
    const expectedResponse = {
      status: 200,
      body: expect.objectContaining({
        data: [
          expect.objectContaining({
            city: codeInDb.city,
            code: codeInDb.code,
            post: codeInDb.post,
          }),
        ],
      }),
    };
    expect(response).toEqual(expect.objectContaining(expectedResponse));

    await postalCodesModel.deleteCode(postalCode.code);
  });
});
