import {clearCsrfToken, ensureCsrfToken} from "./csrf.ts"

const API_URL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "")

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers)
  const csrfHeader = import.meta.env.VITE_CSRF_HEADER || "X-CSRF-Token"
  const method = (options?.method ?? "GET").toUpperCase()
  options?.signal?.throwIfAborted()
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const token = await ensureCsrfToken(() =>
      apiFetch<{csrf_token: string}>("/users/csrf", {cache: "no-store"})
    )
    options?.signal?.throwIfAborted()
    headers.set(csrfHeader, token)
  }
  const response = await fetch(API_URL + path, {credentials: "include", ...options, headers})
  if (!response.ok) {
    if (response.status === 401) clearCsrfToken()
    const body: unknown = await response.json().catch(() => null)
    let message = `HTTP error: ${response.status}`
    if (body && typeof body === "object" && "detail" in body) {
      if (typeof body.detail === "string") message = body.detail
      else if (Array.isArray(body.detail)) {
        const messages = body.detail.flatMap(item =>
          item && typeof item === "object" && typeof item.msg === "string" ? [item.msg] : []
        )
        if (messages.length) message = messages.join("; ")
      }
    }
    throw new ApiError(response.status, message)
  }
  return response.json()
}
