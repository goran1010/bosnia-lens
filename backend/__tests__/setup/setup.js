import { vi } from "vitest";

vi.mock("../../email/confirmationEmail.js", () => ({
  sendConfirmationEmail: vi.fn(async () => {
    return { success: true };
  }),
}));

vi.mock("pino", () => {
  return {
    default: () => ({
      info: vi.fn(),
      error: vi.fn(),
    }),
  };
});

vi.mock("csrf-sync", () => {
  const originalModule = vi.importActual("csrf-sync");
  return {
    ...originalModule,
    csrfSync: () => {
      return {
        csrfSynchronisedProtection: (req, res, next) => {
          next();
        },
      };
    },
  };
});
