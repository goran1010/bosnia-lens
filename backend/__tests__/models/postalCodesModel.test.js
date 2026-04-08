import { postalCodesModel } from "../../models/postalCodesModel.js";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { prismaPostalCodesSpyOnMock } from "./prismaPostalCodesSpyOnMock.js";

beforeEach(() => {
  prismaPostalCodesSpyOnMock();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("postalCodesModel", () => {
  test("getAllPostalCodes returns all postal codes", async () => {
    const postalCodes = await postalCodesModel.getAllPostalCodes();

    expect(Array.isArray(postalCodes)).toBe(true);
    expect(postalCodes.length).toBe(3);
  });

  test("getPostalCodeByCode returns correct postal code", async () => {
    const postalCode = await postalCodesModel.getPostalCodeByCode(71000);

    expect(postalCode).toEqual({
      code: 71000,
      city: "Sarajevo",
      post: "BH_POSTA",
    });
  });

  test("getPostalCodesByCity returns correct postal codes", async () => {
    const postalCodes = await postalCodesModel.getPostalCodesByCity("Sarajevo");

    expect(Array.isArray(postalCodes)).toBe(true);
    expect(postalCodes.length).toBe(2);
    expect(postalCodes).toEqual([
      { code: 71000, city: "Sarajevo", post: "BH_POSTA" },
      { code: 71001, city: "Sarajevo", post: "POSTE_SRP" },
    ]);
  });
});
