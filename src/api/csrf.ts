let token: string | null = null
let pending: Promise<string> | null = null
let generation = 0

export function setCsrfToken(value: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Сервер не вернул CSRF-токен")
  }
  generation++
  token = value
  pending = null
}

// Call after logout or when the session is no longer valid.
export function clearCsrfToken() {
  generation++
  token = null
  pending = null
}

export function ensureCsrfToken(load: () => Promise<{csrf_token: string}>): Promise<string> {
  if (token) return Promise.resolve(token)
  if (pending) return pending

  const currentGeneration = generation
  const request = Promise.resolve().then(load).then(data => {
    if (generation !== currentGeneration) {
      if (token) return token
      throw new Error("Сессия изменилась. Повторите действие.")
    }
    setCsrfToken(data.csrf_token)
    return data.csrf_token
  }).finally(() => {
    if (pending === request) pending = null
  })
  pending = request
  return request
}
