import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const proxy = { "/api": "http://127.0.0.1:3000" };

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: [
        "src/model.ts",
        "src/content.tsx",
        "src/Practice.tsx",
        "src/i18n.tsx",
        "src/VideoTutorial.tsx",
      ],
      reporter: ["text", "html"],
      thresholds: { statements: 90, branches: 85, functions: 90, lines: 90 },
    },
  },
});
