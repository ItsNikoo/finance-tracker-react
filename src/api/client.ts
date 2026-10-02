const API_URL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "")

let csrfToken: string | null = null

export function setCsrfToken(token: string) {
  csrfToken = token
}

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
  if (csrfToken && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    headers.set(csrfHeader, csrfToken)
  }
  const response = await fetch(API_URL + path, {credentials: "include", ...options, headers})
  if (!response.ok) {
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
