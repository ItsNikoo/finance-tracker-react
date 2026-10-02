// Транзакции
export type TransactionType = "income" | "expense"

export type Transaction = {
  id: number,
  category_id: number,
  type: TransactionType,
  amount: number,
  "created_at": string
}

export type TransactionCreate = {
  category_id: number,
  type: TransactionType,
  amount: number
}

// Категории
export type Category = {
  id: number,
  name_en: string,
  name_ru: string,
  type: TransactionType,
}

export type CategoryCreate = Omit<Category, "id">

// Пользователи
export type UserCreate = {
  email: string,
  password: string,
}

export type LoginResponse = {
  csrf_token: string,
  user: {
    id: number,
    email: string,
    created_at: string,
  },
}

// Регистрация
export type RegisterResponse = {
  csrf_token: string,
  user: {
    id: number,
    email: string,
    created_at: string,
  },
}
export type RegisterRequest = {
  email: string,
  password: string,
}
