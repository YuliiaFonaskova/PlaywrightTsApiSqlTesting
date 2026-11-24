import type { APIRequestContext, APIResponse } from "@playwright/test";
import type {
  AddToCartRequest,
  AddToCartResponse,
  CartDetails,
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

  async getCart(cartId: string): Promise<CartDetails> {
    const response = await this.request.get(`/carts/${cartId}`);
    await expectStatus("GET", response, 200);
    return (await response.json()) as CartDetails;
  }

  async addItemResponse(
    cartId: string,
    payload: AddToCartRequest,
  ): Promise<APIResponse> {
    return this.request.post(`/carts/${cartId}`, {
      data: payload,
    });
  }

  async addItem(
    cartId: string,
    payload: AddToCartRequest,
  ): Promise<AddToCartResponse> {
    const response = await this.addItemResponse(cartId, payload);
    await expectStatus("POST", response, 200);
    return (await response.json()) as AddToCartResponse;
  }

  async updateItemQuantity(
    cartId: string,
    payload: AddToCartRequest,
  ): Promise<AddToCartResponse> {
    const response = await this.request.put(
      `/carts/${cartId}/product/quantity`,
      { data: payload },
    );
    await expectStatus("PUT", response, 200);
    return (await response.json()) as AddToCartResponse;
  }

  async removeItem(cartId: string, productId: string): Promise<void> {
    const response = await this.request.delete(
      `/carts/${cartId}/product/${productId}`,
    );
    await expectStatus("DELETE", response, 204);
  }

  async deleteCart(cartId: string): Promise<void> {
    const response = await this.request.delete(`/carts/${cartId}`);
    await expectStatus("DELETE", response, 204);
  }
}

export { CartService };
