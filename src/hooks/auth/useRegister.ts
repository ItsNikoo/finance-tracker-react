import {useMutation} from "@tanstack/react-query"
import {register} from "../../api/register.ts"
import {useBalanceStore} from "../../stores/balanceStore.ts"

export function useRegister(){
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      useBalanceStore.getState().reset()
      void useBalanceStore.getState().refreshAll()
    },
  })
}
