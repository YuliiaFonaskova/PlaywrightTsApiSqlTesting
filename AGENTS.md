# AGENTS.md

Engineering guidelines and agent guardrails for the **PlaywrightTsApiSqlTesting** repository.

## 1. Project Overview

Type-safe API test automation framework built with **Playwright** (`APIRequestContext`) and **TypeScript** (`strict: true`) targeting the local **Practice Software Testing (Toolshop)** Docker stack.

- **Test Runner:** Playwright Test (`api` project in `playwright.config.ts`)
- **Language:** TypeScript (`ES2022`, `moduleResolution: "bundler"`, `strict: true`)
- **Environment:** Docker Compose (`db` MariaDB 10.6 on `:3306`, `api` + `web` on `:8091`, `ui` on `:4200`)
- **Quality Gates:** TypeScript compiler (`tsc --noEmit`), ESLint (`typescript-eslint`), Prettier

## 2. Layered Architecture & Boundaries

Keep responsibilities strictly separated across the four framework layers:

- **`core/`** — Reusable, domain-agnostic utilities (`apiHelpers.ts`, `testData.ts`).
  - Must not import from `business/`, `fixtures/`, or `tests/`.
- **`business/`** — Domain models and API service objects:
  - `types/*.types.ts` — Explicit TypeScript `interface` definitions for request payloads and response contracts.
  - `services/*Service.ts` — Service Object classes wrapping `APIRequestContext` calls (`AuthService`, `ProductService`, `CartService`).
  - Keep business assertions (`expect(...)`) inside test specs, not inside services (only transport status validation via `expectStatus` belongs in service helpers).
  - Expose separate `*Response` methods when tests need raw `APIResponse` objects for negative status-code assertions.
- **`fixtures/`** — Playwright Custom Fixtures (`testFixtures.ts` via `test.extend`) and static test data (`messages.json`, `testData.json`).
  - Manage service instantiation, auth token injection (`authToken`), and isolated resource lifecycle (`cartId` with `try / finally` teardown).
- **`tests/api/`** — Automated test specs (`*.spec.ts`) and `docs/test-cases.md` traceability.
  - Always import `{ test, expect }` from `../../fixtures/testFixtures`.
  - Never call raw `request.get()` / `request.post()` or hardcode endpoints, base URLs, or credentials directly inside specs.

## 3. TypeScript & Code Style Rules

- **Strict Typing:** Maintain `strict: true` without weakening compiler options in `tsconfig.json`. Avoid `any`; use explicit `interface` or `type` definitions.
- **Type-Only Imports:** Always use `import type { ... }` when importing TypeScript types or interfaces (e.g., `APIRequestContext`, `APIResponse`, domain contracts).
- **Formatting & Linting:** All edits must conform to `eslint.config.mjs` and Prettier defaults.
- **Test Traceability:** Keep `docs/test-cases.md` and `README.md` aligned whenever test scenarios or suites are added or modified.

## 4. Security & Environment Guardrails

- **Secrets Protection:** Never read, log, hardcode, or commit `.env` files, tokens, or real credentials. Use `.env.example` as the committed template and read runtime variables via `dotenv` / `core/testData.ts`.
- **Test Isolation:** Tests must remain independent (`fullyParallel: true`) and clean up created resources via fixtures (`try / finally` teardown).
- **No Unverified Changes:** Do not claim tests or checks pass without running them after edits.

## 5. Standard Commands

- **Quality Gates (typecheck + lint + format check):** `npm run check`
- **Auto-format:** `npm run format`
- **Run API tests:** `npm run test:api`
- **Run all tests:** `npm test`
- **Start local Docker stack:** `docker compose up -d --wait`
- **Seed local database:** `docker compose exec -T api php artisan migrate:fresh --seed --force`
