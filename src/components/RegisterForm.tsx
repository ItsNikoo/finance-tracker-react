import Button from "../UI/Button.tsx"
import {formCardClass, inputClass} from "../UI/formStyles.ts"
import {type SyntheticEvent, useRef, useState} from "react"
import {useRegister} from "../hooks/auth/useRegister.ts"
import {ApiError} from "../api/client.ts"

export default function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const submitting = useRef(false)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const registerMutation = useRegister()

  function clearStatus() {
    setError(null)
    setSuccess(null)
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) {
      return
    }
    clearStatus()
    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }
    if (!email.trim() || !password || !confirmPassword) {
      setError("Пожалуйста, заполните все поля")
      return
    }
    submitting.current = true
    registerMutation.mutate({email: email.trim(), password}, {
      onSuccess: () => {
        setSuccess("Регистрация прошла успешно")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
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
      }
    })
  }

  return (
    <div className={formCardClass}>
      <h2 className="mb-4 text-lg font-semibold">Регистрация</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} aria-busy={registerMutation.isPending}>
        <fieldset disabled={registerMutation.isPending} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="register-email">
            Email
            <input
              value={email}
              onChange={event => {
                setEmail(event.target.value)
                clearStatus()
              }}
              className={inputClass}
              type="email"
              id="register-email"
              autoComplete="username"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="register-password">
            Пароль
            <input
              value={password}
              onChange={event => {
                setPassword(event.target.value)
                clearStatus()
              }}
              className={inputClass}
              type="password"
              id="register-password"
              autoComplete="new-password"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="register-confirm-password">
            Повторите пароль
            <input
              value={confirmPassword}
              onChange={event => {
                setConfirmPassword(event.target.value)
                clearStatus()
              }}
              className={inputClass}
              type="password"
              id="register-confirm-password"
              autoComplete="new-password"
              required
            />
          </label>
          <Button type="submit" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Регистрация…" : "Зарегистрироваться"}
          </Button>
        </fieldset>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}
      </form>
    </div>
  )
}
