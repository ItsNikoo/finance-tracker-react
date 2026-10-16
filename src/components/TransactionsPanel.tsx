import TransactionRow from "./TransactionRow.tsx"
import type {Category, Transaction} from "../types.ts"
import DataPanel from "./DataPanel.tsx"
import {useTransactions} from "../hooks/useTransactions.ts"
import {useCategories} from "../hooks/useCategories.ts"
import {sortTransactionsNewestFirst} from "../utils/transactionDate.ts"

export default function TransactionsPanel() {
  const transactionsQuery = useTransactions()
  const categoriesQuery = useCategories()
  const transactions: Transaction[] = sortTransactionsNewestFirst(transactionsQuery.data ?? [])
  const categories: Category[] = categoriesQuery.data ?? []
  return (
    <DataPanel
      title="Транзакции"
      className="rounded-[30px] border-brand-200/80 shadow-[0_8px_30px_rgba(30,50,20,0.05)]"
      isEmpty={transactions.length === 0}
      emptyMessage="Транзакций пока нет"
      isLoading={transactionsQuery.isLoading}
      isError={transactionsQuery.isError}
      refetch={transactionsQuery.refetch}
    >
      <ul className="divide-y divide-slate-100">
        {transactions.map(transaction => {
          const category = categories.find(item => item.id === transaction.category_id)
          return (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              categoryName={category?.name_ru || category?.name_en || `Категория #${transaction.category_id}`}
            />
          )
        })}
      </ul>
    </DataPanel>
  )
}
