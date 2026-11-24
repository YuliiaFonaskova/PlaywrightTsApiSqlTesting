import type { APIResponse } from "@playwright/test";

async function expectStatus(
  method: string,
  response: APIResponse,
  expectedStatus: number,
): Promise<void> {
  const actualStatus = response.status();
  if (actualStatus === expectedStatus) {
    return;
  }

  const body = await response.text();
  throw new Error(
    `${method} ${response.url()} failed: expected status ${expectedStatus}, got ${actualStatus}.\nResponse body: ${body}`,
  );
}

export { expectStatus };
