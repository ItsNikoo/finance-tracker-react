import {getTransactions} from "../api/transactions.ts"
import {useQuery} from "@tanstack/react-query"

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: ({signal}) => getTransactions(signal),
  })

}
