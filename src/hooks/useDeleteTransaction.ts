import {useMutation, useQueryClient} from "@tanstack/react-query"
import {deleteTransaction} from "../api/transactions.ts"
import {useBalanceStore} from "../stores/balanceStore.ts"
import type {Transaction} from "../types.ts"

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Transaction[]>(["transactions"], previous =>
        previous?.filter(transaction => transaction.id !== id)
      )
      void queryClient.invalidateQueries({queryKey: ["transactions"]})
      void useBalanceStore.getState().refreshAll()
    },
  })
}
