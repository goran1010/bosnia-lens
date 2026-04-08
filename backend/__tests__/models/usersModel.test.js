import { usersModel } from "../../models/usersModel.js";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { prismaUsersModelSpyOnMock } from "./utils/prismaUsersModelSpyOnMocks.js";

beforeEach(() => {
  prismaUsersModelSpyOnMock();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("usersModel", () => {
  test("findOne returns null for non-existent user", async () => {
    const user = await usersModel.findOne({ id: 999 });

    expect(user).toBeNull();
  });

  test("findOne returns correct user", async () => {
    const user = await usersModel.findOne({ id: 1 });

    expect(user).toEqual({
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
    });
  });

  test("findMany returns all users", async () => {
    const users = await usersModel.findMany();

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(3);
  });

  test("findMany returns correct users by name", async () => {
    const users = await usersModel.findMany({ name: "Jane Smith" });

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(1);
    expect(users[0]).toEqual({
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
    });
  });

  test("create creates a new user", async () => {
    const newUser = await usersModel.create({
      name: "Bob Brown",
      email: "bob.brown@example.com",
    });

    expect(newUser).toEqual({
      id: 4,
      name: "Bob Brown",
      email: "bob.brown@example.com",
    });
  });

  test("update updates an existing user", async () => {
    const updatedUser = await usersModel.update(
      { id: 1 },
      { name: "Johnathan Doe", email: "johnathan.doe@example.com" },
    );

    expect(updatedUser).toEqual({
      id: 1,
      name: "Johnathan Doe",
      email: "johnathan.doe@example.com",
    });
  });

  test("deleteAll deletes all users", async () => {
    const deletedCount = await usersModel.deleteAll();

    expect(deletedCount).toEqual({ count: 3 });
  });

  test("deleteUser deletes a user", async () => {
    const deletedUser = await usersModel.deleteUser({ id: 1 });

    expect(deletedUser).toEqual({ count: 1 });
  });
});
