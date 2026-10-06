import {useMutation, useQueryClient} from "@tanstack/react-query"
import {login} from "../../api/login.ts"
import type {LoginResponse, UserCreate} from "../../types.ts"

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation<LoginResponse, Error, UserCreate>({
    mutationFn: login,
    onSuccess: data => {
      queryClient.setQueryData(["user"], data.user)
      void queryClient.invalidateQueries({queryKey: ["transactions"]})
      void queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}
