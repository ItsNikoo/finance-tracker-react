import type {Category, Transaction} from "../types.ts"
import DataPanel, {type ListQuery} from "./DataPanel.tsx"

const amountFormatter = new Intl.NumberFormat("ru-RU", {maximumFractionDigits: 2})
const dateFormatter = new Intl.DateTimeFormat("ru-RU")
function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "Дата не указана" : dateFormatter.format(date)
}

export default function TransactionsPanel({query, categories}: {query: ListQuery<Transaction>, categories: Category[]}) {
  const transactions = query.data ?? []
  const categoryNames = new Map(categories.map(category => [category.id, category.name_ru || category.name_en]))
  return (
    <DataPanel title="Транзакции" {...query} isEmpty={transactions.length === 0} emptyMessage="Транзакций пока нет">
      <ul className="divide-y divide-slate-100">
        {transactions.map(transaction => (
          <li key={transaction.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="min-w-0">
              <p className="break-words font-medium">{categoryNames.get(transaction.category_id) ?? `Категория #${transaction.category_id}`}</p>
              <p className="mt-1 text-sm text-slate-500">
                {formatDate(transaction.created_at)} · {transaction.type === "income" ? "Доход" : "Расход"}
              </p>
            </div>
            <span className={`font-semibold tabular-nums ${transaction.type === "income" ? "text-brand-600" : "text-slate-900"}`}>
              {transaction.type === "income" ? "+" : "−"}{amountFormatter.format(Math.abs(transaction.amount))}
            </span>
          </li>
        ))}
      </ul>
    </DataPanel>
  )
}
