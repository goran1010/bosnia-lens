import { vi } from "vitest";

vi.mock("pino", () => {
  return {
    default: () => ({
      info: vi.fn(),
      error: vi.fn(),
    }),
  };
});
