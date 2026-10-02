import type {LoginResponse, UserCreate} from "../types.ts"
import {apiFetch} from "./client.ts"
import {setCsrfToken} from "./csrf.ts"

export async function login(data: UserCreate): Promise<LoginResponse> {
  const response = await apiFetch<LoginResponse>("/users/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  })
  setCsrfToken(response.csrf_token)
  return response
}
