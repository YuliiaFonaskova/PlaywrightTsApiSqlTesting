import { expect, test } from "@playwright/test";
test.describe("API Health", () => {
  test("GET /status returns 200", async ({ request }) => {
    const response = await request.get("/status");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeTruthy();
  });
});
