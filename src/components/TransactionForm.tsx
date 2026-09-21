import {useRef, useState} from "react"
import type {FormEvent} from "react"
import {createTransaction} from "../api/transactions.ts"
import type {Category, TransactionType} from "../types.ts"
import type {ListQuery} from "./DataPanel.tsx"
import Button from "../UI/Button.tsx"

import {formCardClass, inputClass} from "../UI/formStyles.ts"

export default function TransactionForm({categoriesQuery, onCreated}: {
  categoriesQuery: ListQuery<Category>,
  onCreated: () => void,
}) {
  const [type, setType] = useState<TransactionType>("expense")
  const [categoryId, setCategoryId] = useState("")
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const submitting = useRef(false)
  const categories = (categoriesQuery.data ?? []).filter(category => category.type === type)
  const unavailable = categoriesQuery.isLoading || categoriesQuery.isError || categories.length === 0

  function clearMessages() {
    setError(null)
    setSuccess(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    clearMessages()
    const category = categories.find(item => String(item.id) === categoryId)
    const numericAmount = Number(amount)
    if (unavailable || !category) {
      setError("Выберите доступную категорию")
      return
    }
    if (!amount.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Введите сумму больше нуля")
      return
    }
    submitting.current = true
    setIsSubmitting(true)
    try {
      await createTransaction({category_id: category.id, type, amount: numericAmount})
      setAmount("")
      setSuccess(true)
      onCreated()
    } catch {
      setError("Не удалось создать транзакцию. Проверьте соединение и попробуйте ещё раз.")
    } finally {
      submitting.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <section className={formCardClass} aria-labelledby="transaction-form-title">
      <div className="mb-6">
        <h2 id="transaction-form-title" className="text-lg font-semibold">Новая транзакция</h2>
        <p className="mt-1 text-sm text-slate-500">Запишите поступление или покупку.</p>
      </div>
      <form onSubmit={handleSubmit} aria-busy={isSubmitting}>
        <fieldset disabled={isSubmitting} className="grid items-end gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Тип
            <select className={inputClass} value={type} onChange={event => {
              setType(event.target.value as TransactionType)
              setCategoryId("")
              clearMessages()
            }}>
              <option value="expense">Расход</option>
              <option value="income">Доход</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Категория
            <select className={inputClass} value={categoryId} required disabled={unavailable} onChange={event => {
              setCategoryId(event.target.value)
              clearMessages()
            }}>
              <option value="" disabled>{categoriesQuery.isLoading ? "Загрузка категорий…" : "Выберите категорию"}</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name_ru || category.name_en}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Сумма
            <input className={inputClass} type="number" inputMode="decimal" min="0.01" step="0.01" required placeholder="0,00" value={amount} onChange={event => {
              setAmount(event.target.value)
              clearMessages()
            }}/>
          </label>
          <Button type="submit" disabled={isSubmitting || unavailable}>
            {isSubmitting ? "Сохранение…" : "Добавить транзакцию"}
          </Button>
        </fieldset>
        {categoriesQuery.isError ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-red-700" role="alert">
            <p>Не удалось загрузить категории.</p>
            <Button variant="secondary" onClick={categoriesQuery.refetch}>Повторить</Button>
          </div>
        ) : !categoriesQuery.isLoading && categories.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Для выбранного типа пока нет категорий.</p>
        ) : null}
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="mt-4 text-sm text-brand-600">Транзакция добавлена</p>}
      </form>
    </section>
  )
}
