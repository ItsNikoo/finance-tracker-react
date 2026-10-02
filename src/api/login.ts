import type {LoginResponse, UserCreate} from "../types.ts"
import {apiFetch, setCsrfToken} from "./client.ts"

export async function login(data: UserCreate): Promise<LoginResponse> {
  const csrf = await apiFetch<{csrf_token: string}>("/users/csrf")
  setCsrfToken(csrf.csrf_token)
  return apiFetch<LoginResponse>("/users/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  })
}
