export interface CreateCartResponse {
  id: string;
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
}

export interface AddToCartResponse {
  result: string;
}
