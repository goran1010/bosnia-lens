import { describe, test, expect, vi } from "vitest";

describe("process.env.URL missing or undefined", () => {
  test("should throw an error if process.env.URL is missing", async () => {
    const originalEnv = process.env;

    // Replace process.env with a clean object
    process.env = {};

    vi.resetModules();
    vi.mock("dotenv/config", () => ({}));
    delete process.env.URL;

    let error;
    try {
      await import("../index.js");
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.message).toBe(
      "Missing required environment variable: process.env.URL",
    );

    process.env = originalEnv;
    vi.unmock("dotenv/config");
  });
});
