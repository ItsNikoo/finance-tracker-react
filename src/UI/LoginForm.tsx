import {useState} from "react"
import Button from "./Button.tsx"

interface LoginFormProps {
  email: string;
  password: string;
}

interface APIResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

function LoginForm() {
  const API_URL = import.meta.env.VITE_BACKEND_URL
  const [formData, setFormData] = useState<LoginFormProps>({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<LoginFormProps>({
    email: "",
    password: "",
  })
  const [response, setResponse] = useState<APIResponse | null>(null)

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setFormErrors({email: "", password: ""})

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setFormErrors(prev => ({...prev, email: "Заполните Email корректно"}))
      return
    }

    if (!formData.password.trim()) {
      setFormErrors(prev => ({...prev, password: "Пароль не может быть пустым"}))
      return
    }

    try {
      setSuccess(null)
      setIsLoading(true)
      const formBody = new URLSearchParams()
      formBody.append("username", formData.email)
      formBody.append("password", formData.password)

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError("Неверный email или пароль")
        } else if (response.status === 422) {
          setError("Некорректные данные")
        } else if (response.status === 429) {
          setError("Слишком много попыток. Попробуйте позже")
        } else {
          setError("Ошибка сервера. Попробуйте позже")
        }
        return // важно — не бросаем throw, чтобы не попасть в catch
      }

      const result: APIResponse = await response.json()
      setResponse(result)
      setError(null)
      setSuccess("Успешный вход")
      setFormData({email: "", password: ""})
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Неизвестная ошибка")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
        <div>
          {/* Email */}
          <div className="flex flex-col gap-0.5">
            <label className="text-slate-300 text-sm font-medium">Ваш Email</label>
            <input
              placeholder="name@mail.ru"
              className={`border rounded-xl py-2 px-3 
              placeholder-slate-500 outline-none transition-all focus:ring-2 
              focus:ring-brand-500 focus:border-transparent 
              ${formErrors.email ? "border-red-500" : "border-slate-600"}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="text"
            />
            {formErrors.email && (
              <p className="text-red-400 text-xs">{formErrors.email}</p>
            )}
          </div>

          {/* Пароль */}
          <div className="flex flex-col gap-0.5">
            <label className="text-slate-300 text-sm font-medium">Ваш пароль</label>
            <input
              placeholder="Пароль"
              className={`border rounded-xl py-2 px-3 
              placeholder-slate-500 outline-none transition-all focus:ring-2 
              focus:ring-brand-500 focus:border-transparent 
              ${formErrors.password ? "border-red-500" : "border-slate-600"}`}
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
            />
            {formErrors.password && (
              <p className="text-red-400 text-xs">{formErrors.password}</p>
            )}
          </div>
        </div>

        {/* Global messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
            <p className="text-emerald-400 text-sm">{success}</p>
          </div>
        )}

        <Button
          disabled={isLoading}
          type="submit">{isLoading ? "Загрузка..." : "Войти"}</Button>
      </form>
      <pre>{JSON.stringify(response)}</pre>
    </>
  )
}

export default LoginForm