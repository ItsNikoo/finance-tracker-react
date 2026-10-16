import {apiFetch} from "./client.ts"
import type {Transaction, TransactionCreate} from "../types.ts"

type StatsType = "income" | "expenses"

export function getTransactions(signal?: AbortSignal) {
  return apiFetch<Transaction[]>("/transactions", {signal})
}

export function createTransaction(data: TransactionCreate) {
  return apiFetch<Transaction>("/transactions", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  })
}

export function deleteTransaction(id: number) {
  return apiFetch<void>(`/transactions/${id}`, {method: "DELETE"})
}


export function getBalance(month?: number, year?: number, signal?: AbortSignal) {
  const params = new URLSearchParams()

  if (month !== undefined) {
    params.set("month", String(month))
  }

  if (year !== undefined) {
    params.set("year", String(year))
  }

  const query = params.toString()

  return apiFetch<number>(
    `/transactions/balance${query ? `?${query}` : ""}`, {signal}
  )
}

export function getMonthlyState(type: StatsType, month?: number, year?: number, signal?: AbortSignal) {
  const params = new URLSearchParams()

  if (month !== undefined) {
    params.set("month", String(month))
  }

  if (year !== undefined) {
    params.set("year", String(year))
  }

  const query = params.toString()

  return apiFetch<number>(
    `/transactions/balance/${type}${query ? `?${query}` : ""}`, {signal}
  )
}
