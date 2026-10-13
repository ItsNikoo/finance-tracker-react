
import {type SyntheticEvent, useState} from "react"
import {useCreateTransaction} from "../hooks/useCreateTransaction.ts"
import type {PaymentMethod, TransactionType} from "../types.ts"
import {useCategories} from "../hooks/useCategories.ts"
import Button from "../UI/Button.tsx"
import {formCardClass, inputClass} from "../UI/formStyles.ts"

const paymentMethods: {value: PaymentMethod; label: string}[] = [
  {value: "cash", label: "Наличные"},
  {value: "card", label: "Карта"},
  {value: "transfer", label: "Перевод"},
]

interface TransactionFormProps {
  embedded?: boolean,
}

const transactionInputClass = inputClass.replace("text-sm", "text-base")

export default function TransactionForm({embedded = false}: TransactionFormProps) {
  const categoriesQuery = useCategories()
  const createTransactionMutation = useCreateTransaction()

  const [type, setType] = useState<TransactionType>("expense")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [categoryId, setCategoryId] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)

  const categories = (categoriesQuery.data ?? []).filter(
    category => category.type === type
  )

  const unavailable =
    categoriesQuery.isLoading ||
    categoriesQuery.isError ||
    categories.length === 0

  function clearMessages() {
    setValidationError(null)
    createTransactionMutation.reset()
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    if (createTransactionMutation.isPending) return

    clearMessages()

    const category = categories.find(
      item => String(item.id) === categoryId
    )

    const numericAmount = Number(amount)

    if (unavailable || !category) {
      setValidationError("Выберите доступную категорию")
      return
    }

    if (
      !amount.trim() ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setValidationError("Введите сумму больше нуля")
      return
    }

    if (!paymentMethods.some(method => method.value === paymentMethod)) {
      setValidationError("Выберите способ оплаты")
      return
    }

    createTransactionMutation.mutate(
      {
        category_id: category.id,
        type,
        amount: numericAmount,
        payment_method: paymentMethod,
        description: description.trim(),
      },
      {
        onSuccess: () => {
          setAmount("")
          setDescription("")
        },
      }
    )
  }

  return (
    <section
      className={embedded ? "min-w-0" : formCardClass}
      aria-labelledby="transaction-form-title"
    >
      <div className="mb-6">
        <h2
          id="transaction-form-title"
          className={embedded ? "sr-only" : "text-lg font-semibold"}
        >
          Новая транзакция
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Запишите поступление или покупку.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        aria-busy={createTransactionMutation.isPending}
      >
        <fieldset
          disabled={createTransactionMutation.isPending}
          className="min-w-0 space-y-5"
        >
          {/* Тип и категория */}
          <div className="grid min-w-0 gap-4">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Тип транзакции

              <select
                className={transactionInputClass}
                value={type}
                onChange={event => {
                  setType(event.target.value as TransactionType)
                  setCategoryId("")
                  clearMessages()
                }}
              >
                <option value="expense">Расход</option>
                <option value="income">Доход</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Категория

              <select
                className={transactionInputClass}
                value={categoryId}
                required
                disabled={unavailable}
                onChange={event => {
                  setCategoryId(event.target.value)
                  clearMessages()
                }}
              >
                <option value="" disabled>
                  {categoriesQuery.isLoading
                    ? "Загрузка категорий…"
                    : "Выберите категорию"}
                </option>

                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name_ru || category.name_en}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Способ оплаты и сумма */}
          <div className="grid min-w-0 gap-4">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Способ оплаты

              <select
                className={transactionInputClass}
                value={paymentMethod}
                required
                onChange={event => {
                  setPaymentMethod(event.target.value as PaymentMethod)
                  clearMessages()
                }}
              >
                {paymentMethods.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Сумма

              <input
                className={transactionInputClass}
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                required
                placeholder="0,00"
                value={amount}
                onChange={event => {
                  setAmount(event.target.value)
                  clearMessages()
                }}
              />
            </label>
          </div>

          {/* Описание на всю ширину */}
          <label className="flex flex-col gap-2 text-sm font-medium">
            <span className="flex items-center justify-between gap-2">
              <span>Описание</span>
              <span className="text-xs font-normal text-slate-400">
                Необязательно
              </span>
            </span>

            <textarea
              className={`${transactionInputClass} min-h-24 w-full resize-y leading-relaxed`}
              rows={3}
              maxLength={255}
              placeholder="Например: Купил продукты в магазине, оплатил картой..."
              value={description}
              onChange={event => {
                setDescription(event.target.value)
                clearMessages()
              }}
            />

            <span className="flex justify-end text-xs font-normal text-slate-400">
              {description.length} / 255
            </span>
          </label>

          {/* Кнопка отправки */}
          <div className="flex justify-end border-t border-slate-200 pt-5">
            <Button
              className="w-full"
              type="submit"
              disabled={createTransactionMutation.isPending || unavailable}
            >
              {createTransactionMutation.isPending
                ? "Сохранение…"
                : "Добавить транзакцию"}
            </Button>
          </div>
        </fieldset>

        {/* Ошибки категорий */}
        {categoriesQuery.isError ? (
          <div
            className="mt-4 flex flex-wrap items-center gap-3 text-sm text-red-700"
            role="alert"
          >
            <p>Не удалось загрузить категории.</p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => void categoriesQuery.refetch()}
            >
              Повторить
            </Button>
          </div>
        ) : !categoriesQuery.isLoading && categories.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Для выбранного типа пока нет категорий.
          </p>
        ) : null}

        {/* Ошибки валидации */}
        {validationError && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {validationError}
          </p>
        )}

        {/* Ошибки backend */}
        {createTransactionMutation.isError && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {createTransactionMutation.error.message}
          </p>
        )}

        {/* Успешное создание */}
        {createTransactionMutation.isSuccess && (
          <p role="status" className="mt-4 text-sm text-brand-600">
            Транзакция добавлена
          </p>
        )}
      </form>
    </section>
  )
}
