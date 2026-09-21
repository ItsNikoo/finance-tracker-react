import {useRef, useState} from "react"
import type {FormEvent} from "react"
import {createCategory} from "../api/categories.ts"
import type {TransactionType} from "../types.ts"
import Button from "../UI/Button.tsx"
import {formCardClass, inputClass} from "../UI/formStyles.ts"

export default function CategoryForm({onCreated}: {onCreated: () => void}) {
  const [nameRu, setNameRu] = useState("")
  const [nameEn, setNameEn] = useState("")
  const [type, setType] = useState<TransactionType>("expense")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const submitting = useRef(false)

  function clearMessages() {
    setError(null)
    setSuccess(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    clearMessages()
    if (!nameRu.trim() || !nameEn.trim()) {
      setError("Заполните название на русском и английском")
      return
    }
    submitting.current = true
    setIsSubmitting(true)
    try {
      await createCategory({name_ru: nameRu.trim(), name_en: nameEn.trim(), type})
      setNameRu("")
      setNameEn("")
      setSuccess(true)
      onCreated()
    } catch {
      setError("Не удалось создать категорию. Проверьте данные и попробуйте ещё раз.")
    } finally {
      submitting.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <section className={formCardClass} aria-labelledby="category-form-title">
      <div className="mb-6">
        <h2 id="category-form-title" className="text-lg font-semibold">Новая категория</h2>
        <p className="mt-1 text-sm text-slate-500">Организуйте доходы и расходы по своему.</p>
      </div>
      <form onSubmit={handleSubmit} onChange={clearMessages} aria-busy={isSubmitting}>
        <fieldset disabled={isSubmitting} className="grid gap-4 sm:grid-cols-2">
          <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-slate-600">
            Название на русском
            <input className={inputClass} required placeholder="Например, Продукты" value={nameRu} onChange={event => setNameRu(event.target.value)}/>
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-slate-600">
            Название на английском
            <input className={inputClass} required placeholder="Например, Groceries" value={nameEn} onChange={event => setNameEn(event.target.value)}/>
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-slate-600">
            Тип
            <select className={inputClass} value={type} onChange={event => setType(event.target.value as TransactionType)}>
              <option value="expense">Расход</option>
              <option value="income">Доход</option>
            </select>
          </label>
          <Button className="self-end" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Сохранение…" : "Добавить категорию"}
          </Button>
        </fieldset>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="mt-4 rounded-xl bg-brand-50 p-3 text-sm text-brand-700">Категория добавлена и доступна в форме транзакции</p>}
      </form>
    </section>
  )
}
