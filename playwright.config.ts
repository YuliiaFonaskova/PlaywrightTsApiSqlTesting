import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["github"], ["list"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "api",
      testMatch: "**/api/**/*.spec.ts",
      use: {
        baseURL: process.env.API_BASE_URL ?? "http://localhost:8091",
      },
    },
    {
      name: "e2e",
      testMatch: "**/e2e/**/*.spec.ts",
      use: {
        baseURL: process.env.UI_BASE_URL ?? "http://localhost:4200",
      },
    },
  ],
});
