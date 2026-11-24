import { expect, test } from "../../fixtures/testFixtures";

test.describe("Products API", () => {
  test("GET /products returns non-empty list", async ({ productService }) => {
    const result = await productService.getProducts();
    expect(result.total).toBeGreaterThan(0);
    expect(result.data.length).toBeGreaterThan(0);
  });
});
