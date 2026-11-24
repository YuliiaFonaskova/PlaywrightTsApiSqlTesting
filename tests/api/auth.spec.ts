import { expectStatus } from "../../core/apiHelpers";
import { getTestUserCredentials } from "../../core/testData";
import messages from "../../fixtures/messages.json";
import testData from "../../fixtures/testData.json";
import { expect, test } from "../../fixtures/testFixtures";

test.describe("Auth API", () => {
  test("POST /users/login returns access token for valid credentials", async ({
    authService,
  }) => {
    const response = await authService.login(getTestUserCredentials());
    expect(response.access_token).toBeTruthy();
    expect(response.token_type).toBe(messages.auth.tokenType);
    expect(response.expires_in).toBeGreaterThan(0);
  });

  test("GET /users/me returns current user profile with valid token", async ({
    authService,
    authToken,
  }) => {
    const profile = await authService.getMe(authToken);
    expect(profile.id).toBeTruthy();
    expect(profile.email).toBe(getTestUserCredentials().email);
  });

  test("POST /users/login returns 401 for wrong password", async ({
    authService,
  }) => {
    const { email } = getTestUserCredentials();
    const response = await authService.loginResponse({
      email,
      password: testData.wrongPassword,
    });
    await expectStatus("POST", response, 401);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBe(messages.auth.unauthorized);
  });

  test("GET /users/me returns 401 without token", async ({ authService }) => {
    const response = await authService.getMeResponse();
    await expectStatus("GET", response, 401);
    const body = (await response.json()) as { message: string };
    expect(body.message).toBe(messages.auth.unauthorized);
  });
});
