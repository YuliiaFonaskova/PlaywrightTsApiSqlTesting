import type { APIRequestContext, APIResponse } from "@playwright/test";
import type {
  LoginRequest,
  LoginResponse,
  UserProfile,
} from "../types/auth.types";
import { expectStatus } from "../../core/apiHelpers";

class AuthService {
  request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async loginResponse(payload: LoginRequest): Promise<APIResponse> {
    return this.request.post("/users/login", { data: payload });
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await this.loginResponse(payload);
    await expectStatus("POST", response, 200);
    return (await response.json()) as LoginResponse;
  }

  async getMeResponse(token?: string): Promise<APIResponse> {
    if (token) {
      return this.request.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    return this.request.get("/users/me");
  }

  async getMe(token: string): Promise<UserProfile> {
    const response = await this.getMeResponse(token);
    await expectStatus("GET", response, 200);
    return (await response.json()) as UserProfile;
  }
}

export { AuthService };
