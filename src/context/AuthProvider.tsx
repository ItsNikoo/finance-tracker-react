import type {AuthContextType, User} from "../types"
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { AuthContext } from "./AuthContext"


export function AuthProvider({children}: { children: React.ReactNode }) {
  const API_URL = import.meta.env.VITE_BACKEND_URL

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) {
          setUser(null)
          return
        }

        const data: User = await response.json()
        setUser(data)
      } catch (error) {
        console.error("Ошибка проверки сессии:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [API_URL])

  const login = useCallback(async (email: string, password: string) => {
    const formBody = new URLSearchParams()
    formBody.append("username", email)
    formBody.append("password", password)

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody.toString(),
    })

    if (!response.ok) {
      throw new Error("Неверный логин или пароль")
    }

    const data = await response.json()
    setUser(data.user)
  }, [API_URL])

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Ошибка выхода:", error)
    } finally {
      setUser(null)
    }
  }, [API_URL])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      setUser,
    }),
    [user, isLoading, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

