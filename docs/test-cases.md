# Test Cases & Coverage Matrix

This document contains API test cases for the **Practice Software Testing (Toolshop)** local Docker stack, along with the current test coverage.

---

## 1. Coverage Matrix

**Coverage Summary:** **11** automated API test scenarios across **4** functional suites.

| ID          | Suite    | Title                                                | Priority | Type                | Automation Status | Spec File                    |
| :---------- | :------- | :--------------------------------------------------- | :------- | :------------------ | :---------------- | :--------------------------- |
| `HEALTH-01` | Health   | API health check endpoint returns 200                | P1       | Smoke / API         | Automated         | `tests/api/health.spec.ts`   |
| `PROD-01`   | Products | Get products list returns non-empty catalog          | P1       | Positive / API      | Automated         | `tests/api/products.spec.ts` |
| `PROD-02`   | Products | Get product by ID from catalog returns matching item | P1       | Positive / Chaining | Automated         | `tests/api/products.spec.ts` |
| `PROD-03`   | Products | Get product with non-existent ID returns 404         | P2       | Negative / API      | Automated         | `tests/api/products.spec.ts` |
| `AUTH-01`   | Auth     | Valid user login returns JWT access token            | P1       | Positive / API      | Automated         | `tests/api/auth.spec.ts`     |
| `AUTH-02`   | Auth     | Get current user profile with valid token            | P1       | Positive / API      | Automated         | `tests/api/auth.spec.ts`     |
| `AUTH-03`   | Auth     | Login with invalid password returns 401              | P1       | Negative / API      | Automated         | `tests/api/auth.spec.ts`     |
| `AUTH-04`   | Auth     | Get current user profile without token returns 401   | P2       | Negative / API      | Automated         | `tests/api/auth.spec.ts`     |
| `CART-01`   | Cart     | Create cart and add in-stock product                 | P1       | Positive / Chaining | Automated         | `tests/api/cart.spec.ts`     |
| `CART-02`   | Cart     | Add non-existent product to cart returns 404         | P2       | Negative / API      | Automated         | `tests/api/cart.spec.ts`     |
| `CART-03`   | Cart     | Update cart item quantity and remove item            | P2       | Chaining / CRUD     | Automated         | `tests/api/cart.spec.ts`     |

---

## 2. Test Cases

### Suite: Health (HEALTH)

#### HEALTH-01: API health check endpoint returns 200

- **Priority:** P1
- **Type:** Smoke / API
- **Automation Status:** Automated (`tests/api/health.spec.ts`)
- **Preconditions:** Local Docker stack is running (`API_BASE_URL` is reachable).

**Steps:**

| #   | Action                                                   | Expected result                      |
| :-- | :------------------------------------------------------- | :----------------------------------- |
| 1   | Send `GET /status` request via Playwright `request`.     | Response returns HTTP status `200`.  |
| 2   | Parse the response body as JSON and verify its presence. | Response body is truthy (non-empty). |

**Expected result:** Local API responds with HTTP `200` and a non-empty JSON payload.

---

### Suite: Products (PROD)

#### PROD-01: Get products list returns non-empty catalog

- **Priority:** P1
- **Type:** Positive / API
- **Automation Status:** Automated (`tests/api/products.spec.ts`)
- **Preconditions:** Local Docker stack is running and database is seeded with products.

**Steps:**

| #   | Action                                                 | Expected result                                                    |
| :-- | :----------------------------------------------------- | :----------------------------------------------------------------- |
| 1   | Call `productService.getProducts()` (`GET /products`). | Response returns HTTP status `200` verified by `expectStatus`.     |
| 2   | Verify `total` and `data` fields in the JSON payload.  | `result.total` is greater than `0` and `result.data` is not empty. |

**Expected result:** Paginated product list is returned with `total > 0` and at least one product item in `data`.

---

#### PROD-02: Get product by ID from catalog returns matching item

- **Priority:** P1
- **Type:** Positive / Chaining
- **Automation Status:** Automated (`tests/api/products.spec.ts`)
- **Preconditions:** Local Docker stack is running and database is seeded with products.

**Steps:**

| #   | Action                                                                       | Expected result                                                    |
| :-- | :--------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| 1   | Call `productService.getProducts()` and take the first product (`data[0]`).  | Catalog returns at least one product with a valid `id` and `name`. |
| 2   | Call `productService.getProductById(firstProduct.id)` (`GET /products/:id`). | Response returns HTTP status `200` and matching `id` and `name`.   |

**Expected result:** Product details retrieved by ID match the selected product from the catalog list.

---

#### PROD-03: Get product with non-existent ID returns 404

- **Priority:** P2
- **Type:** Negative / API
- **Automation Status:** Automated (`tests/api/products.spec.ts`)
- **Preconditions:** Local Docker stack is running.

**Steps:**

| #   | Action                                                           | Expected result                                                |
| :-- | :--------------------------------------------------------------- | :------------------------------------------------------------- |
| 1   | Call `productService.getProductByIdResponse("non-existent-id")`. | Response returns HTTP status `404` verified by `expectStatus`. |
| 2   | Parse the JSON error payload and check the `message` field.      | `body.message` equals `"Requested item not found"`.            |

**Expected result:** API responds with HTTP `404` and `"Requested item not found"` error message.

---

### Suite: Auth (AUTH)

#### AUTH-01: Valid user login returns JWT access token

- **Priority:** P1
- **Type:** Positive / API
- **Automation Status:** Automated (`tests/api/auth.spec.ts`)
- **Preconditions:** Seeded user credentials are configured in `.env`.

**Steps:**

| #   | Action                                                                    | Expected result                                                         |
| :-- | :------------------------------------------------------------------------ | :---------------------------------------------------------------------- |
| 1   | Call `authService.login(getTestUserCredentials())` (`POST /users/login`). | Response returns HTTP `200` verified by `expectStatus`.                 |
| 2   | Verify `access_token`, `token_type`, and `expires_in` in the response.    | `access_token` is truthy, `token_type` is `"bearer"`, `expires_in > 0`. |

**Expected result:** Valid user credentials authenticate successfully and return a bearer token.

---

#### AUTH-02: Get current user profile with valid token

- **Priority:** P1
- **Type:** Positive / API
- **Automation Status:** Automated (`tests/api/auth.spec.ts`)
- **Preconditions:** Valid `authToken` fixture is injected.

**Steps:**

| #   | Action                                                       | Expected result                                                 |
| :-- | :----------------------------------------------------------- | :-------------------------------------------------------------- |
| 1   | Call `authService.getMe(authToken)` (`GET /users/me`).       | Response returns HTTP `200` verified by `expectStatus`.         |
| 2   | Verify `id` and `email` in the returned user profile object. | `profile.id` is truthy and `profile.email` matches `.env` user. |

**Expected result:** Authenticated user profile is returned for the active token.

---

#### AUTH-03: Login with invalid password returns 401

- **Priority:** P1
- **Type:** Negative / API
- **Automation Status:** Automated (`tests/api/auth.spec.ts`)
- **Preconditions:** Valid user email is configured in `.env`.

**Steps:**

| #   | Action                                                                   | Expected result                                         |
| :-- | :----------------------------------------------------------------------- | :------------------------------------------------------ |
| 1   | Call `authService.loginResponse({ email, password: "wrong-password" })`. | Response returns HTTP `401` verified by `expectStatus`. |
| 2   | Parse the JSON error payload and verify the `error` field.               | `body.error` equals `"Unauthorized"`.                   |

**Expected result:** Server rejects invalid password with HTTP `401` and `"Unauthorized"`.

---

#### AUTH-04: Get current user profile without token returns 401

- **Priority:** P2
- **Type:** Negative / API
- **Automation Status:** Automated (`tests/api/auth.spec.ts`)
- **Preconditions:** Local Docker stack is running.

**Steps:**

| #   | Action                                                       | Expected result                                         |
| :-- | :----------------------------------------------------------- | :------------------------------------------------------ |
| 1   | Call `authService.getMeResponse()` without `Authorization`.  | Response returns HTTP `401` verified by `expectStatus`. |
| 2   | Parse the JSON error payload and verify the `message` field. | `body.message` equals `"Unauthorized"`.                 |

**Expected result:** Protected endpoint rejects unauthenticated requests with HTTP `401`.

---

### Suite: Cart (CART)

#### CART-01: Create cart and add in-stock product

- **Priority:** P1
- **Type:** Positive / Chaining
- **Automation Status:** Automated (`tests/api/cart.spec.ts`)
- **Preconditions:** Local Docker stack is running, catalog has at least one in-stock product, and `cartId` fixture provides an isolated cart.

**Steps:**

| #   | Action                                                                           | Expected result                                                 |
| :-- | :------------------------------------------------------------------------------- | :-------------------------------------------------------------- |
| 1   | Request `cartId` fixture (`POST /carts`) and look up an in-stock product.        | Empty cart is created (`201`) and in-stock `productId` is read. |
| 2   | Add the product via `cartService.addItem(cartId, ...)`.                          | Response returns HTTP `200` and `"item added or updated"`.      |
| 3   | Fetch cart via `cartService.getCart(cartId)` (fixture deletes cart in teardown). | Cart contains `1` item matching `productId` and `quantity: 1`.  |

**Expected result:** Product is added to the newly created cart, verified via `GET /carts/:id`, and cleaned up by the `cartId` fixture.

---

#### CART-02: Add non-existent product to cart returns 404

- **Priority:** P2
- **Type:** Negative / API
- **Automation Status:** Automated (`tests/api/cart.spec.ts`)
- **Preconditions:** Local Docker stack is running and `cartId` fixture provides an isolated cart.

**Steps:**

| #   | Action                                                                                      | Expected result                                         |
| :-- | :------------------------------------------------------------------------------------------ | :------------------------------------------------------ |
| 1   | Inject `cartId` from `testFixtures` (`POST /carts` creates cart).                           | New cart `id` is ready.                                 |
| 2   | Call `cartService.addItemResponse(cartId, { product_id: testData.invalidProductId, ... })`. | Response returns HTTP `404` and `"Resource not found"`. |
| 3   | Test completes and `cartId` fixture deletes the cart in `finally` teardown.                 | Cart is removed (`204`).                                |

**Expected result:** API rejects unknown product ID with HTTP `404` and `"Resource not found"`.

---

#### CART-03: Update cart item quantity and remove item

- **Priority:** P2
- **Type:** Chaining / CRUD
- **Automation Status:** Automated (`tests/api/cart.spec.ts`)
- **Preconditions:** Local Docker stack is running, catalog has an in-stock product, and `cartId` fixture provides an isolated cart.

**Steps:**

| #   | Action                                                                                   | Expected result                                               |
| :-- | :--------------------------------------------------------------------------------------- | :------------------------------------------------------------ |
| 1   | Inject `cartId` and add an in-stock product with `quantity: 1`.                          | Item is added (`200`).                                        |
| 2   | Update quantity to `3` via `cartService.updateItemQuantity(...)`.                        | `GET /carts/:id` shows `quantity: 3`.                         |
| 3   | Remove item via `cartService.removeItem(cartId, productId)` (`cartId` deletes the cart). | `DELETE` returns `204` and `cart_items` becomes empty (`[]`). |

**Expected result:** Cart item supports full create → read → update → delete lifecycle via API.
