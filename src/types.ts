export interface User {
  userId: number;
  userName: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}