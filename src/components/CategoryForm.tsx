import {type SyntheticEvent, useState} from "react"
import type { TransactionType } from "../types.ts"
import Button from "../UI/Button.tsx"
import { formCardClass, inputClass } from "../UI/formStyles.ts"
import { useCreateCategory } from "../hooks/useCreateCategory.ts"

export default function CategoryForm() {
  const [nameRu, setNameRu] = useState("")
  const [nameEn, setNameEn] = useState("")
  const [type, setType] = useState<TransactionType>("expense")

  const createCategoryMutation = useCreateCategory()

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!nameRu.trim() || !nameEn.trim()) {
      return
    }

    createCategoryMutation.mutate(
      {
        name_ru: nameRu.trim(),
        name_en: nameEn.trim(),
        type,
      },
      {
        onSuccess: () => {
          setNameRu("")
          setNameEn("")
        },
      }
    )
  }

  return (
    <section
      className={formCardClass}
      aria-labelledby="category-form-title"
    >
      <div className="mb-6">
        <h2
          id="category-form-title"
          className="text-lg font-semibold"
        >
          Новая категория
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Организуйте доходы и расходы по своему.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        aria-busy={createCategoryMutation.isPending}
      >
        <fieldset
          disabled={createCategoryMutation.isPending}
          className="grid gap-4 sm:grid-cols-2"
        >
          <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-slate-600">
            Название на русском

            <input
              className={inputClass}
              required
              placeholder="Например, Продукты"
              value={nameRu}
              onChange={event => {
                setNameRu(event.target.value)
                createCategoryMutation.reset()
              }}
            />
          </label>

          <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-slate-600">
            Название на английском

            <input
              className={inputClass}
              required
              placeholder="Например, Groceries"
              value={nameEn}
              onChange={event => {
                setNameEn(event.target.value)
                createCategoryMutation.reset()
              }}
            />
          </label>

          <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-slate-600">
            Тип

            <select
              className={inputClass}
              value={type}
              onChange={event => {
                setType(event.target.value as TransactionType)
                createCategoryMutation.reset()
              }}
            >
              <option value="expense">Расход</option>
              <option value="income">Доход</option>
            </select>
          </label>

          <Button
            className="self-end"
            type="submit"
            disabled={createCategoryMutation.isPending}
          >
            {createCategoryMutation.isPending
              ? "Сохранение…"
              : "Добавить категорию"}
          </Button>
        </fieldset>

        {createCategoryMutation.isError && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            Не удалось создать категорию. Проверьте данные и попробуйте ещё раз.
          </p>
        )}

        {createCategoryMutation.isSuccess && (
          <p
            role="status"
            className="mt-4 rounded-xl bg-brand-50 p-3 text-sm text-brand-700"
          >
            Категория добавлена и доступна в форме транзакции
          </p>
        )}
      </form>
    </section>
  )
}