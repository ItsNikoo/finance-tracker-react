import {apiFetch, setCsrfToken} from "./client.ts"
import type {RegisterRequest, RegisterResponse} from "../types.ts"

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const csrf = await apiFetch<{csrf_token: string}>("/users/csrf")
  setCsrfToken(csrf.csrf_token)
  return apiFetch<RegisterResponse>("/users/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  })
}