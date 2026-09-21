import {getTransactions} from "../api/transactions.ts"
import {useApiQuery} from "./useApiQuery.ts"

export function useTransactions() {
  return useApiQuery(getTransactions)
}
