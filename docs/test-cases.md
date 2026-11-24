# Test Cases & Coverage Matrix

This document contains test cases for the **Practice Software Testing (Toolshop)** local Docker stack (`API + MariaDB SQL + UI`), along with the current test coverage.

---

## 1. Coverage Matrix

**Coverage Summary:** **2** automated API test scenarios across **2** functional suites.

| ID          | Suite    | Title                                       | Priority | Type           | Automation Status | Spec File                    |
| :---------- | :------- | :------------------------------------------ | :------- | :------------- | :---------------- | :--------------------------- |
| `HEALTH-01` | Health   | API health check endpoint returns 200       | P1       | Smoke / API    | Automated         | `tests/api/health.spec.ts`   |
| `PROD-01`   | Products | Get products list returns non-empty catalog | P1       | Positive / API | Automated         | `tests/api/products.spec.ts` |

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
