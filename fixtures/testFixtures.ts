import { test as base, expect } from "@playwright/test";
import { AuthService } from "../business/services/AuthService";
import { CartService } from "../business/services/CartService";
import { ProductService } from "../business/services/ProductService";

type TestFixtures = {
  productService: ProductService;
  authService: AuthService;
  cartService: CartService;
  authToken: string;
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
    const email = process.env.USER_EMAIL;
    const password = process.env.USER_PASSWORD;
    if (!email || !password) {
      throw new Error("USER_EMAIL and USER_PASSWORD must be set in .env");
    }
    const loginResponse = await authService.login({ email, password });
    await use(loginResponse.access_token);
  },
});

export { test, expect };
