import type { LoginRequest } from "../business/types/auth.types";

function getTestUserCredentials(): LoginRequest {
  const email = process.env.USER_EMAIL;
  const password = process.env.USER_PASSWORD;
  if (!email || !password) {
    throw new Error("USER_EMAIL and USER_PASSWORD must be set in .env");
  }
  return { email, password };
}

export { getTestUserCredentials };
