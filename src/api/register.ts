import {apiFetch} from "./client.ts"
import {setCsrfToken} from "./csrf.ts"
import type {RegisterRequest, RegisterResponse} from "../types.ts"

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiFetch<RegisterResponse>("/users/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  })
  setCsrfToken(response.csrf_token)
  return response
}
