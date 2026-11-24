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

export interface CartItem {
  id: string;
  quantity: number;
  cart_id: string;
  product_id: string;
}

export interface CartDetails {
  id: string;
  cart_items: CartItem[];
}
