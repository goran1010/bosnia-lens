import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: "./__tests__/setup/globalSetup.js",
    coverage: {
      exclude: [
        "__tests__/**",
        "vitest.config.js",
        "node_modules/**",
        "generated/**",
      ],
    },
  },
});
