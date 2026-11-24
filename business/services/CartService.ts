import type { APIRequestContext } from "@playwright/test";
import type {
  AddToCartRequest,
  AddToCartResponse,
  CreateCartResponse,
} from "../types/cart.types";
import { expectStatus } from "../../core/apiHelpers";

class CartService {
  request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createCart(): Promise<CreateCartResponse> {
    const response = await this.request.post("/carts", { data: {} });
    await expectStatus("POST", response, 201);
    return (await response.json()) as CreateCartResponse;
  }

  async addItem(
    cartId: string,
    payload: AddToCartRequest,
  ): Promise<AddToCartResponse> {
    const response = await this.request.post(`/carts/${cartId}`, {
      data: payload,
    });
    await expectStatus("POST", response, 200);
    return (await response.json()) as AddToCartResponse;
  }
}

export { CartService };
