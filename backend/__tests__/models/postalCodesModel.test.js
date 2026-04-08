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

    expect(Array.isArray(postalCodes)).toBe(true);
    expect(postalCodes.length).toBe(3);
  });

  test("getPostalCodeByCode errors when no code is provided", async () => {
    await expect(postalCodesModel.getPostalCodeByCode()).rejects.toThrow();
  });

  test("getPostalCodeByCode returns null for non-existent code", async () => {
    const postalCode = await postalCodesModel.getPostalCodeByCode(99999);

    expect(postalCode).toBeNull();
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

  test("createMany creates multiple postal codes", async () => {
    const result = await postalCodesModel.createMany([
      { postalCode: 72000, city: "Tuzla", post: "BH_POSTA" },
      { postalCode: 73000, city: "Mostar", post: "HP_MOSTAR" },
    ]);

    expect(result).toEqual({ count: 2 });
  });

  test("createNew creates a new postal code with valid post", async () => {
    const newPostalCode = await postalCodesModel.createNew(
      "Zenica",
      75000,
      "POSTE_SRP",
    );
    expect(newPostalCode).toEqual({
      code: 75000,
      city: "Zenica",
      post: "POSTE_SRP",
    });
  });

  test("createNew creates a new postal code without post if post is invalid", async () => {
    const newPostalCode = await postalCodesModel.createNew(
      "Mostar",
      73000,
      "INVALID_POST",
    );
    expect(newPostalCode).toEqual({
      code: 73000,
      city: "Mostar",
      post: null,
    });
  });

  test("edit updates an existing postal code with valid post", async () => {
    const updatedPostalCode = await postalCodesModel.edit(
      "Sarajevo",
      71000,
      "HP_MOSTAR",
    );
    expect(updatedPostalCode).toEqual({
      code: 71000,
      city: "Sarajevo",
      post: "HP_MOSTAR",
    });
  });

  test("edit updates an existing postal code without post if post is invalid", async () => {
    const updatedPostalCode = await postalCodesModel.edit(
      "Sarajevo",
      71001,
      "INVALID_POST",
    );
    expect(updatedPostalCode).toEqual({
      code: 71001,
      city: "Sarajevo",
      post: null,
    });
  });

  test("deleteCode deletes a postal code", async () => {
    const deletedPostalCode = await postalCodesModel.deleteCode(78000);
    expect(deletedPostalCode).toEqual({
      code: 78000,
      city: "Deleted City",
      post: "Deleted Post",
    });
  });
});
