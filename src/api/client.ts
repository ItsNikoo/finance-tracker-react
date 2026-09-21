const API_URL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "")

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(API_URL + path, {...options, headers: new Headers(options?.headers)})
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
  return response.json()
}
