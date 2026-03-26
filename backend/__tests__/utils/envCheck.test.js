import { describe, test, expect, vi } from "vitest";

describe("process.env variable missing or undefined", () => {
  test("envCheck should throw an error if process.env.FRONTEND_URL is missing", async () => {
    vi.stubEnv("FRONTEND_URL", undefined);

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
