import { describe, test, expect, vi } from "vitest";

describe("process.env.URL missing or undefined", () => {
  test("envCheck should throw an error if process.env.URL is missing", async () => {
    vi.stubEnv("URL", undefined);

    let error;
    try {
      await import("../../config/envCheck.js");
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.message).toMatch(/Missing required environment variable/i);

    vi.unstubAllEnvs();
  });
});
