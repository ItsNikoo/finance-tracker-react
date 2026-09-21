import {getCategories} from "../api/categories.ts"
import {useApiQuery} from "./useApiQuery.ts"

export function useCategories() {
  return useApiQuery(getCategories)
}
