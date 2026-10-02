import {useMutation, useQueryClient} from "@tanstack/react-query"
import {login} from "../../api/login.ts"
import {setCsrfToken} from "../../api/client.ts"
import type {LoginResponse, UserCreate} from "../../types.ts"

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation<LoginResponse, Error, UserCreate>({
    mutationFn: login,
    onSuccess: data => {
      setCsrfToken(data.csrf_token)
      queryClient.setQueryData(["user"], data.user)
      void queryClient.invalidateQueries({queryKey: ["transactions"]})
      void queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}
