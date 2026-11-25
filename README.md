# PlaywrightTsApiSqlTesting

Type-safe API test automation framework built with Playwright and TypeScript for the local **Practice Software Testing (Toolshop)** Docker stack.

The project follows a layered architecture:

- **Core layer** — reusable utilities independent of business logic (diagnostic API helper, environment credentials loader).
- **Business layer** — TypeScript API contracts (`types/`) and typed API service classes (`services/`).
- **Fixtures layer** — Playwright Custom Fixtures (`test.extend`) providing ready-to-use services and auth token.
- **Tests layer** — automated API test specs and Playwright configuration.

---

## Technologies

- TypeScript (`strict: true`)
- Playwright Test Runner (`APIRequestContext` + Custom Fixtures)
- Docker & Docker Compose (local Toolshop UI, API, and MariaDB 10.6 stack)
- ESLint (`typescript-eslint`) & Prettier
- Dotenv

---

## Test Scenarios & Coverage Matrix

**Coverage Summary:** **11** automated API test scenarios across **4** functional suites.

Detailed test cases, preconditions, and step-by-step actions are documented in [docs/test-cases.md](docs/test-cases.md).

Format: **ID** · Priority · Status — Title

#### Health (`tests/api/health.spec.ts`)

- **HEALTH-01** · P1 · Automated — API health check endpoint returns 200

#### Products (`tests/api/products.spec.ts`)

- **PROD-01** · P1 · Automated — Get products list returns non-empty catalog
- **PROD-02** · P1 · Automated — Get product by ID from catalog returns matching item
- **PROD-03** · P2 · Automated — Get product with non-existent ID returns 404

#### Auth (`tests/api/auth.spec.ts`)

- **AUTH-01** · P1 · Automated — Valid user login returns JWT access token
- **AUTH-02** · P1 · Automated — Get current user profile with valid token
- **AUTH-03** · P1 · Automated — Login with invalid password returns 401
- **AUTH-04** · P2 · Automated — Get current user profile without token returns 401

#### Cart (`tests/api/cart.spec.ts`)

- **CART-01** · P1 · Automated — Create cart and add in-stock product
- **CART-02** · P2 · Automated — Add non-existent product to cart returns 404
- **CART-03** · P2 · Automated — Update cart item quantity and remove item

---

## Project Structure

```text
docs/
└── test-cases.md

core/
├── apiHelpers.ts
└── testData.ts

business/
├── services/
│   ├── AuthService.ts
│   ├── CartService.ts
│   └── ProductService.ts
└── types/
    ├── auth.types.ts
    ├── cart.types.ts
    └── product.types.ts

fixtures/
├── messages.json
├── testData.json
└── testFixtures.ts

tests/
└── api/
    ├── auth.spec.ts
    ├── cart.spec.ts
    ├── health.spec.ts
    └── products.spec.ts

docker-compose.yml
eslint.config.mjs
package.json
playwright.config.ts
tsconfig.json
.env.example
```

---

## Features

- Strict TypeScript type checking (`tsc --noEmit`)
- API testing via Playwright `APIRequestContext` with diagnostic error reporting (`expectStatus`)
- Custom Playwright Fixtures (`test.extend`) for services and authenticated token injection
- Separate `api` and `e2e` projects in `playwright.config.ts`
- Test configuration via environment variables in `.env`
- Code quality gates via ESLint and Prettier (`npm run check`)
- Trace capture on first retry (`on-first-retry`) and HTML test report

---

## Installation & Local Setup

```bash
npm install
```

Copy `.env.example` to `.env` (update values if needed), then start and seed the local Docker stack:

```bash
docker compose up -d --wait
docker compose exec -T api php artisan migrate:fresh --seed --force
```

---

## Test Execution Commands

| Action                       | Command                                          |
| :--------------------------- | :----------------------------------------------- |
| Run all tests                | `npm test`                                       |
| Run API project tests        | `npm run test:api`                               |
| Run single spec              | `npx playwright test tests/api/products.spec.ts` |
| Open HTML report             | `npx playwright show-report`                     |
| Run typecheck, lint & format | `npm run check`                                  |
| Format code with Prettier    | `npm run format`                                 |
