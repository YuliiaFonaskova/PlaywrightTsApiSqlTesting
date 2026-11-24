import type { LoginRequest } from "../business/types/auth.types";

function createUniqueEmail(): string {
  const uniquePart = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  return `qa_${uniquePart}@example.com`;
}

function getTestUserCredentials(): LoginRequest {
  const email = process.env.USER_EMAIL;
  const password = process.env.USER_PASSWORD;
  if (!email || !password) {
    throw new Error("USER_EMAIL and USER_PASSWORD must be set in .env");
  }
  return { email, password };
}

export { createUniqueEmail, getTestUserCredentials };
