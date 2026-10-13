import {useMutation, useQueryClient} from "@tanstack/react-query"
import {login} from "../../api/login.ts"
import type {LoginResponse, UserCreate} from "../../types.ts"
import {useBalanceStore} from "../../stores/balanceStore.ts"

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation<LoginResponse, Error, UserCreate>({
    mutationFn: login,
    onSuccess: data => {
      useBalanceStore.getState().reset()
      void useBalanceStore.getState().refreshAll()
      queryClient.setQueryData(["user"], data.user)
      void queryClient.invalidateQueries({queryKey: ["transactions"]})
      void queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}
