export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}
