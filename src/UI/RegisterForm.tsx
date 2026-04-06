import {useState} from "react";

interface RegisterFormProps {
  username: string;
  email: string;
  password: string;
}

function RegisterForm() {
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState<RegisterFormProps>({
    username: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState<null | string>(null)
  const [formErrors, setFormErrors] = useState<RegisterFormProps>({
    username: "",
    email: "",
    password: "",
  })
  const [success, setSuccess] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setFormErrors({
      username: "", email: "", password: ""
    })

    if (!
      formData.username.trim()
    ) {
      setFormErrors(prev => ({...prev, username: "Имя пользователя не может быть пустым"}))
      return;
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setFormErrors(prev => ({...prev, email: "Заполните Email корректно"}))
      return;
    }

    if (!formData.password.trim()) {
      setFormErrors(prev => ({...prev, password: "Пароль не может быть пустым"}))
      return;
    }

    try {
      setSuccess(null)
      setIsLoading(true)
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: formData.username,
          email: formData.email,
          password: formData.password,
        })
      })

      if (!response.ok) {
        throw new Error("Ошибка регистрации");
      }

      await response.json();
      setError(null)
      setSuccess("Регистрация прошла успешно!")
      setFormData({username: "", email: "", password: ""})
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Неизвестная ошибка");
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">

        <form
          onSubmit={handleSubmit}
          className="p-8 flex flex-col gap-2"
        >
          {/* Username */}
          <div className="flex flex-col gap-0.5">
            <label className="text-slate-300 text-sm font-medium">Имя пользователя</label>
            <input
              placeholder="username"
              className={`border rounded-xl py-2 px-3 
              placeholder-slate-500 outline-none transition-all focus:ring-2 
              focus:ring-brand-500 focus:border-transparent 
              ${formErrors.username ? "border-red-500" : "border-slate-600"}`}
              name="username"
              value={formData.username}
              onChange={handleChange}
              type="text"
            />
            {formErrors.username && (
              <p className="text-red-400 text-xs">{formErrors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-0.5">
            <label className="text-slate-300 text-sm font-medium">Email</label>
            <input
              placeholder="example@mail.com"
              className={`border rounded-xl py-2 px-3 
              placeholder-slate-500 outline-none transition-all focus:ring-2 
              focus:ring-brand-500 focus:border-transparent 
              ${formErrors.username ? "border-red-500" : "border-slate-600"}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="text"
            />
            {formErrors.email && (
              <p className="text-red-400 text-xs">{formErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-0.5">
            <label className="text-slate-300 text-sm font-medium">Пароль</label>
            <input
              placeholder="••••••••"
              className={`border rounded-xl py-2 px-3 
              placeholder-slate-500 outline-none transition-all focus:ring-2 
              focus:ring-brand-500 focus:border-transparent 
              ${formErrors.username ? "border-red-500" : "border-slate-600"}`}
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
            />
            {formErrors.password && (
              <p className="text-red-400 text-xs">{formErrors.password}</p>
            )}
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

          <button
            className="bg-brand-500 hover:bg-brand-700 disabled:bg-brand-900 disabled:cursor-not-allowed text-white rounded-xl text-base font-semibold px-5 py-3.5 transition-colors mt-3 cursor-pointer"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterForm;