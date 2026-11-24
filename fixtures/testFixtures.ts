import { test as base, expect } from "@playwright/test";
import { AuthService } from "../business/services/AuthService";
import { CartService } from "../business/services/CartService";
import { ProductService } from "../business/services/ProductService";
import { getTestUserCredentials } from "../core/testData";

type TestFixtures = {
  productService: ProductService;
  authService: AuthService;
  cartService: CartService;
  authToken: string;
  cartId: string;
};

const test = base.extend<TestFixtures>({
  productService: async ({ request }, use) => {
    const service = new ProductService(request);
    await use(service);
  },
  authService: async ({ request }, use) => {
    const service = new AuthService(request);
    await use(service);
  },
  cartService: async ({ request }, use) => {
    const service = new CartService(request);
    await use(service);
  },
  authToken: async ({ authService }, use) => {
    const loginResponse = await authService.login(getTestUserCredentials());
    await use(loginResponse.access_token);
  },
  cartId: async ({ cartService }, use) => {
    const cart = await cartService.createCart();
    try {
      await use(cart.id);
    } finally {
      await cartService.deleteCart(cart.id);
    }
  },
});

export { test, expect };
