import {useMutation, useQueryClient} from "@tanstack/react-query"
import {createTransaction} from "../api/transactions.ts"
import {useBalanceStore} from "../stores/balanceStore.ts"

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      void useBalanceStore.getState().refreshAll()
      void queryClient.invalidateQueries({queryKey: ["transactions"]})
    },
  })
}
