import {useMutation, useQueryClient} from "@tanstack/react-query"
import {createTransaction} from "../api/transactions.ts"

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["transactions"]})
    },
  })
}
