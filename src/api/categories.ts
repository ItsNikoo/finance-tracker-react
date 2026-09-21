import {apiFetch} from "./client.ts"
import type {Category, CategoryCreate} from "../types.ts"

export function getCategories(signal?: AbortSignal) {
  return apiFetch<Category[]>("/categories", {signal})
}

export function createCategory(data: CategoryCreate) {
  return apiFetch<Category>("/categories", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  })
}
