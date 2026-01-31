import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: "./tests/setup/globalSetup.js",
    coverage: {
      exclude: [
        "tests/**",
        "vitest.config.js",
        "node_modules/**",
        "generated/**",
      ],
    },
  },
});
