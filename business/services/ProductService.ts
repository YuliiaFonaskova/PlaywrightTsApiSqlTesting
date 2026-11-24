import type { APIRequestContext } from "@playwright/test";
import type { Product, ProductResponse } from "../types/product.types";
import { expectStatus } from "../../core/apiHelpers";

class ProductService {
  request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getProducts(): Promise<ProductResponse> {
    const response = await this.request.get("/products");
    await expectStatus("GET", response, 200);
    return (await response.json()) as ProductResponse;
  }

  async getProductById(id: string): Promise<Product> {
    const response = await this.request.get(`/products/${id}`);
    await expectStatus("GET", response, 200);
    return (await response.json()) as Product;
  }
}

export { ProductService };
