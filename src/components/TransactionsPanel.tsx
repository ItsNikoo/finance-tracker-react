import type {Category, Transaction} from "../types.ts"
import DataPanel from "./DataPanel.tsx"
import {useTransactions} from "../hooks/useTransactions.ts"
import {useCategories} from "../hooks/useCategories.ts"

const amountFormatter = new Intl.NumberFormat("ru-RU", {maximumFractionDigits: 2})
const dateFormatter = new Intl.DateTimeFormat("ru-RU")

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "Дата не указана" : dateFormatter.format(date)
}

export default function TransactionsPanel() {
  const transactionsQuery = useTransactions()
  const categoriesQuery = useCategories()
  const transactions: Transaction[] = transactionsQuery.data ?? []
  const categories: Category[] = categoriesQuery.data ?? []
  return (
    <DataPanel
      title="Транзакции"
      isEmpty={transactions.length === 0}
      emptyMessage="Транзакций пока нет"
      isLoading={transactionsQuery.isLoading}
      isError={transactionsQuery.isError}
      refetch={transactionsQuery.refetch}
    >
      <ul className="divide-y divide-slate-100">
        {transactions.map(transaction => (
          <li key={transaction.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="min-w-0">
              <p className="wrap-break-word font-medium">
                {categories.find(c => c.id === transaction.category_id)?.name_ru
                  || categories.find(c => c.id === transaction.category_id)?.name_en
                  || `Категория #${transaction.category_id}`}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {formatDate(transaction.created_at)} · {transaction.type === "income" ? "Доход" : "Расход"}
              </p>
            </div>
            <span
              className={`font-semibold tabular-nums ${transaction.type === "income" ? "text-brand-600" : "text-slate-900"}`}>
              {transaction.type === "income" ? "+" : "−"}{amountFormatter.format(Math.abs(transaction.amount))}
            </span>
          </li>
        ))}
      </ul>
    </DataPanel>
  )
}
