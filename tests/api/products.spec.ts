import { expectStatus } from "../../core/apiHelpers";
import messages from "../../fixtures/messages.json";
import testData from "../../fixtures/testData.json";
import { expect, test } from "../../fixtures/testFixtures";

test.describe("Products API", () => {
  test("GET /products returns non-empty list", async ({ productService }) => {
    const result = await productService.getProducts();
    expect(result.total).toBeGreaterThan(0);
    expect(result.data.length).toBeGreaterThan(0);
  });

  test("GET /products/:id returns matching product", async ({
    productService,
  }) => {
    const list = await productService.getProducts();
    const firstProduct = list.data[0];

    const product = await productService.getProductById(firstProduct.id);
    expect(product.id).toBe(firstProduct.id);
    expect(product.name).toBe(firstProduct.name);
  });

  test("GET /products/:id returns 404 for non-existent id", async ({
    productService,
  }) => {
    const response = await productService.getProductByIdResponse(
      testData.invalidProductId,
    );
    await expectStatus("GET", response, 404);
    const body = (await response.json()) as { message: string };
    expect(body.message).toBe(messages.products.notFound);
  });
});
