import { postalCodesModel } from "../../models/postalCodesModel.js";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { prismaPostalCodesSpyOnMock } from "./utils/prismaPostalCodesSpyOnMock.js";

beforeEach(() => {
  prismaPostalCodesSpyOnMock();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("postalCodesModel", () => {
  test("getAllPostalCodes returns all postal codes", async () => {
    const postalCodes = await postalCodesModel.getAllPostalCodes();
    const expectedResult = {
      isArray: true,
      length: 3,
    };

    expect({
      isArray: Array.isArray(postalCodes),
      length: postalCodes.length,
    }).toEqual(expectedResult);
  });

  test("getPostalCodeByCode returns null for non-existent code", async () => {
    const postalCode = await postalCodesModel.getPostalCodeByCode(99999);
    const expectedResult = null;

    expect(postalCode).toBe(expectedResult);
  });

  test("getPostalCodeByCode returns correct postal code", async () => {
    const postalCode = await postalCodesModel.getPostalCodeByCode(71000);
    const expectedResult = {
      code: 71000,
      city: "Sarajevo",
      post: "BH_POSTA",
    };

    expect(postalCode).toEqual(expectedResult);
  });

  test("getPostalCodesByCity returns correct postal codes", async () => {
    const postalCodes = await postalCodesModel.getPostalCodesByCity("Sarajevo");
    const expectedResult = {
      isArray: true,
      length: 2,
      data: [
        { code: 71000, city: "Sarajevo", post: "BH_POSTA" },
        { code: 71001, city: "Sarajevo", post: "POSTE_SRP" },
      ],
    };

    expect({
      isArray: Array.isArray(postalCodes),
      length: postalCodes.length,
      data: postalCodes,
    }).toEqual(expectedResult);
  });

  test("createMany creates multiple postal codes", async () => {
    const result = await postalCodesModel.createMany([
      { postalCode: 72000, city: "Tuzla", post: "BH_POSTA" },
      { postalCode: 73000, city: "Mostar", post: "HP_MOSTAR" },
    ]);
    const expectedResult = { count: 2 };

    expect(result).toEqual(expectedResult);
  });

  test("createNew creates a new postal code with valid post", async () => {
    const newPostalCode = await postalCodesModel.createNew({
      city: "Zenica",
      code: 75000,
      post: "POSTE_SRP",
    });
    const expectedResult = {
      code: 75000,
      city: "Zenica",
      post: "POSTE_SRP",
    };

    expect(newPostalCode).toEqual(expectedResult);
  });

  test("createNew creates a new postal code without post if post is invalid", async () => {
    const newPostalCode = await postalCodesModel.createNew({
      city: "Mostar",
      code: 73000,
      post: "INVALID_POST",
    });
    const expectedResult = {
      code: 73000,
      city: "Mostar",
      post: null,
    };

    expect(newPostalCode).toEqual(expectedResult);
  });

  test("edit updates an existing postal code with valid post", async () => {
    const updatedPostalCode = await postalCodesModel.edit({
      city: "Sarajevo",
      code: 71000,
      post: "HP_MOSTAR",
    });
    const expectedResult = {
      code: 71000,
      city: "Sarajevo",
      post: "HP_MOSTAR",
    };

    expect(updatedPostalCode).toEqual(expectedResult);
  });

  test("edit updates an existing postal code without post if post is invalid", async () => {
    const updatedPostalCode = await postalCodesModel.edit({
      city: "Sarajevo",
      code: 71001,
      post: "INVALID_POST",
    });
    const expectedResult = {
      code: 71001,
      city: "Sarajevo",
      post: null,
    };

    expect(updatedPostalCode).toEqual(expectedResult);
  });

  test("deleteCode deletes a postal code", async () => {
    const deletedPostalCode = await postalCodesModel.deleteCode({
      code: 78000,
    });
    const expectedResult = {
      code: 78000,
      city: "Deleted City",
      post: "Deleted Post",
    };

    expect(deletedPostalCode).toEqual(expectedResult);
  });
});
