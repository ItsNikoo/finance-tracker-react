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
export type Category = {
  id: number,
  name_en: string,
  name_ru: string,
  type: TransactionType,
}

export type CategoryCreate = Omit<Category, "id">
