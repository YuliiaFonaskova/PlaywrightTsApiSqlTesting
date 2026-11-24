import type { APIRequestContext } from "@playwright/test";
import type { LoginRequest, LoginResponse } from "../types/auth.types";
import { expectStatus } from "../../core/apiHelpers";

class AuthService {
  request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await this.request.post("/users/login", { data: payload });
    await expectStatus("POST", response, 200);
    return (await response.json()) as LoginResponse;
  }
}

export { AuthService };
