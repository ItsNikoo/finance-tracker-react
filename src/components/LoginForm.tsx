import Button from "../UI/Button.tsx"
import {formCardClass, inputClass} from "../UI/formStyles.ts"
import {useRef, useState, type SyntheticEvent} from "react"
import {useLogin} from "../hooks/auth/useLogin.ts"
import {ApiError} from "../api/client.ts"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const submitting = useRef(false)
  const loginMutation = useLogin()

  function clearStatus() {
    setError(null)
    setSuccess(null)
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    clearStatus()
    if (!email.trim() || !password) {
      setError("Пожалуйста, заполните все поля")
      return
    }
    submitting.current = true
    loginMutation.mutate({email: email.trim(), password}, {
      onSuccess: () => {
        setPassword("")
        setSuccess("Успешный вход")
      },
      onError: failure => {
        if (failure instanceof ApiError) {
          setError(`Ошибка ${failure.status}: ${failure.message}`)
        } else {
          setError("Не удалось связаться с сервером. Проверьте подключение и попробуйте ещё раз.")
        }
      },
      onSettled: () => {
        submitting.current = false
      },
    })
  }

  return (
    <div className={formCardClass}>
      <h2 className="mb-4 text-lg font-semibold">Вход</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} aria-busy={loginMutation.isPending}>
        <fieldset disabled={loginMutation.isPending} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="login-email">
            Email
            <input value={email} onChange={event => {setEmail(event.target.value)
                clearStatus()}}
              className={inputClass} type="email" id="login-email" autoComplete="username" required/>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="login-password">
            Пароль
            <input value={password} onChange={event => {setPassword(event.target.value)
                clearStatus()}}
              className={inputClass} type="password" id="login-password" autoComplete="current-password" required/>
          </label>
          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Вход…" : "Войти"}
          </Button>
        </fieldset>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}
      </form>
    </div>
  )
}
