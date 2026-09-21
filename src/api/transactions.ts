import {apiFetch} from "./client.ts"
import type {Transaction, TransactionCreate} from "../types.ts"

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
