import {useId, useRef, useState} from "react"
import {ChevronDown, LoaderCircle, Pencil, Trash2} from "lucide-react"
import type {Transaction} from "../types.ts"
import {useDeleteTransaction} from "../hooks/useDeleteTransaction.ts"
import {formatTransactionDate, getTransactionDate} from "../utils/transactionDate.ts"

interface TransactionRowProps {
  transaction: Transaction,
  categoryName: string,
}

const amountFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency", currency: "RUB", minimumFractionDigits: 2, maximumFractionDigits: 2,
})

export default function TransactionRow({transaction, categoryName}: TransactionRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const descriptionId = useId()
  const deleteMutation = useDeleteTransaction()
  const deleteInProgress = useRef(false)
  const isIncome = transaction.type === "income"
  const date = getTransactionDate(transaction)

  function handleDelete() {
    if (deleteInProgress.current) return
    deleteInProgress.current = true
    deleteMutation.mutate(transaction.id, {
      onSettled: () => {deleteInProgress.current = false},
    })
  }

  return (
    <li className="py-3" aria-busy={deleteMutation.isPending}>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_4rem] items-center gap-2">
        <button
          type="button"
          className="col-span-2 grid min-w-0 grid-cols-2 items-center gap-2 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-brand-500"
          aria-expanded={isExpanded}
          aria-controls={descriptionId}
          onClick={() => setIsExpanded(previous => !previous)}
        >
          <span className="min-w-0">
            <span className="flex items-center gap-1">
              <span className="min-w-0 wrap-anywhere text-sm font-medium text-slate-900">{categoryName}</span>
              <ChevronDown size={14} className={`shrink-0 text-slate-400 motion-safe:transition-transform ${isExpanded ? "rotate-180" : ""}`} aria-hidden="true"/>
            </span>
            <time className="mt-1 block text-[11px] leading-4 text-slate-400" dateTime={date ?? undefined}>
              {formatTransactionDate(date)}
            </time>
          </span>
          <span className={`min-w-0 wrap-anywhere text-right text-base font-semibold tabular-nums ${isIncome ? "text-brand-700" : "text-rose-700"}`}>
            {isIncome ? "+" : "−"}{amountFormatter.format(Math.abs(transaction.amount))}
          </span>
        </button>
        <div className="flex items-center justify-end">
          <button
            type="button"
            disabled
            aria-label={`Редактировать транзакцию ${transaction.id} — скоро`}
            title="Редактирование — скоро"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 disabled:cursor-default"
          >
            <Pencil size={16} aria-hidden="true"/>
          </button>
          <button
            type="button"
            disabled={deleteMutation.isPending}
            aria-label={`Удалить транзакцию ${transaction.id}`}
            title="Удалить транзакцию"
            onClick={handleDelete}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-rose-400 disabled:cursor-wait disabled:opacity-50"
          >
            {deleteMutation.isPending ? <LoaderCircle size={16} className="motion-safe:animate-spin" aria-hidden="true"/> : <Trash2 size={16} aria-hidden="true"/>}
          </button>
        </div>
      </div>
      <div id={descriptionId} hidden={!isExpanded} className="mt-3 rounded-xl bg-slate-50 p-3">
        <p className="mb-1 text-xs font-medium text-slate-500">Описание</p>
        <p className="wrap-anywhere whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {transaction.description?.trim() || "не указано"}
        </p>
      </div>
      {deleteMutation.isError && (
        <p role="alert" className="mt-2 wrap-anywhere text-xs text-rose-700">
          Не удалось удалить транзакцию: {deleteMutation.error.message}
        </p>
      )}
    </li>
  )
}
