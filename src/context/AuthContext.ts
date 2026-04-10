import {createContext} from "react"

class AuthContextType {
}

export const AuthContext = createContext<AuthContextType | null>(null)
