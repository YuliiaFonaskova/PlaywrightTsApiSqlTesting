import { expectStatus } from "../../core/apiHelpers";
import type { ProductService } from "../../business/services/ProductService";
import messages from "../../fixtures/messages.json";
import testData from "../../fixtures/testData.json";
import { expect, test } from "../../fixtures/testFixtures";

async function getFirstInStockProductId(
  productService: ProductService,
): Promise<string> {
  const products = await productService.getProducts();
  const inStockProduct = products.data.find((item) => item.in_stock);
  if (!inStockProduct) {
    throw new Error("Expected at least one in-stock product in catalog");
  }
  return inStockProduct.id;
}

test.describe("Cart API", () => {
  test("POST /carts and POST /carts/:id creates cart and adds in-stock product", async ({
    cartId,
    cartService,
    productService,
  }) => {
    const productId = await getFirstInStockProductId(productService);

    const addResponse = await cartService.addItem(cartId, {
      product_id: productId,
      quantity: 1,
    });
    expect(addResponse.result).toBe(messages.cart.itemAddedOrUpdated);

    const details = await cartService.getCart(cartId);
    expect(details.cart_items).toHaveLength(1);
    expect(details.cart_items[0].product_id).toBe(productId);
    expect(details.cart_items[0].quantity).toBe(1);
  });

  test("POST /carts/:id returns 404 for non-existent product", async ({
    cartId,
    cartService,
  }) => {
    const response = await cartService.addItemResponse(cartId, {
      product_id: testData.invalidProductId,
      quantity: 1,
    });
    await expectStatus("POST", response, 404);
    const body = (await response.json()) as { message: string };
    expect(body.message).toBe(messages.cart.notFound);
  });

  test("PUT and DELETE cart endpoints update quantity and remove item", async ({
    cartId,
    cartService,
    productService,
  }) => {
    const productId = await getFirstInStockProductId(productService);

    await cartService.addItem(cartId, {
      product_id: productId,
      quantity: 1,
    });

    await cartService.updateItemQuantity(cartId, {
      product_id: productId,
      quantity: 3,
    });
    const updated = await cartService.getCart(cartId);
    expect(updated.cart_items[0].quantity).toBe(3);

    await cartService.removeItem(cartId, productId);
    const emptied = await cartService.getCart(cartId);
    expect(emptied.cart_items).toHaveLength(0);
  });
});
