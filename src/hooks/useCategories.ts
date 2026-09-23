import {getCategories} from "../api/categories.ts"
import {useQuery} from "@tanstack/react-query"

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: ({signal}) => getCategories(signal),
  })
}
