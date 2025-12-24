import { describe, test, expect, vi } from "vitest";

describe.skip("process.env.URL missing or undefined", () => {
  test("should throw an error if process.env.URL is missing", async () => {
    vi.resetModules();
    vi.stubEnv("PORT", undefined);

    let error;
    try {
      await import("../app.js");
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.message).toBe(
      "Missing required environment variable: process.env.URL",
    );

    vi.unstubAllEnvs();
  });
});
