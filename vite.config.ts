import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: [
        "src/model.ts",
        "src/Practice.tsx",
        "src/i18n.tsx",
        "src/VideoTutorial.tsx",
      ],
      reporter: ["text", "html"],
      thresholds: { statements: 90, branches: 85, functions: 90, lines: 90 },
    },
  },
});
