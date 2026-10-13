import {create} from "zustand"
import {getBalance, getMonthlyState} from "../api/transactions.ts"

interface BalanceStore {
  balance: number | null
  income: number | null
  expenses: number | null

  isBalanceLoading: boolean
  balanceError: Error | null

  isMonthlyStatsLoading: boolean
  monthlyStatsError: Error | null

  month: number
  year: number

  loadBalance: () => Promise<void>
  loadMonthlyStats: (month?: number, year?: number) => Promise<void>
  refreshAll: () => Promise<void>
  reset: () => void
}

function getInitialState() {
  const today = new Date()

  return {
    balance: null,
    income: null,
    expenses: null,

    isBalanceLoading: false,
    balanceError: null,

    isMonthlyStatsLoading: false,
    monthlyStatsError: null,

    month: today.getMonth() + 1,
    year: today.getFullYear(),
  }
}

export const useBalanceStore = create<BalanceStore>((set, get) => {
  let balanceRequest: AbortController | null = null
  let monthlyRequest: AbortController | null = null

  return {
    ...getInitialState(),

    loadBalance: async () => {
      balanceRequest?.abort()

      const request = new AbortController()
      balanceRequest = request

      set({
        balance: null,
        isBalanceLoading: true,
        balanceError: null,
      })

      try {
        const balance = await getBalance(
          undefined,
          undefined,
          request.signal
        )

        if (request !== balanceRequest) return

        if (typeof balance !== "number" || !Number.isFinite(balance)) {
          throw new Error("Сервер вернул некорректный баланс")
        }

        set({
          balance,
          isBalanceLoading: false,
        })
      } catch (error) {
        if (request !== balanceRequest) return

        set({
          balance: null,
          isBalanceLoading: false,
          balanceError: error instanceof Error
            ? error
            : new Error("Не удалось загрузить баланс"),
        })
      } finally {
        if (request === balanceRequest) {
          balanceRequest = null
        }
      }
    },

    loadMonthlyStats: async (
      month = get().month,
      year = get().year
    ) => {
      monthlyRequest?.abort()

      const request = new AbortController()
      monthlyRequest = request

      set({
        month,
        year,
        income: null,
        expenses: null,
        isMonthlyStatsLoading: true,
        monthlyStatsError: null,
      })

      try {
        const [income, expenses] = await Promise.all([
          getMonthlyState("income", month, year, request.signal),
          getMonthlyState("expenses", month, year, request.signal),
        ])

        if (request !== monthlyRequest) return

        if (
          typeof income !== "number" ||
          !Number.isFinite(income) ||
          typeof expenses !== "number" ||
          !Number.isFinite(expenses)
        ) {
          throw new Error("Сервер вернул некорректную статистику")
        }

        set({
          income,
          expenses,
          isMonthlyStatsLoading: false,
        })
      } catch (error) {
        if (request !== monthlyRequest) return

        // Если один запрос упал, второй больше не нужен.
        request.abort()

        set({
          income: null,
          expenses: null,
          isMonthlyStatsLoading: false,
          monthlyStatsError: error instanceof Error
            ? error
            : new Error("Не удалось загрузить статистику"),
        })
      } finally {
        if (request === monthlyRequest) {
          monthlyRequest = null
        }
      }
    },

    refreshAll: async () => {
      const {loadBalance, loadMonthlyStats} = get()

      await Promise.all([
        loadBalance(),
        loadMonthlyStats(),
      ])
    },

    reset: () => {
      balanceRequest?.abort()
      monthlyRequest?.abort()

      balanceRequest = null
      monthlyRequest = null

      set(getInitialState())
    },
  }
})