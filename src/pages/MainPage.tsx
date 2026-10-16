import {useEffect} from "react"
import TransactionsPanel from "../components/TransactionsPanel.tsx"
import CategoriesPanel from "../components/CategoriesPanel.tsx"
import BalanceCard from "../components/Cards/BalanceCard.tsx"
import MonthlyStatsCard from "../components/Cards/MonthlyStatsCard.tsx"
import BalanceCardSkeleton from "../components/Cards/BalanceCardSkeleton.tsx"
import MonthlyStatsCardSkeleton from "../components/Cards/MonthlyStatsCardSkeleton.tsx"
import Button from "../UI/Button.tsx"
import {useBalanceStore} from "../stores/balanceStore.ts"
import {useNavigate} from "react-router"

export default function MainPage() {
  const balance = useBalanceStore(state => state.balance)
  const income = useBalanceStore(state => state.income)
  const expenses = useBalanceStore(state => state.expenses)
  const isBalanceLoading = useBalanceStore(state => state.isBalanceLoading)
  const balanceError = useBalanceStore(state => state.balanceError)
  const isMonthlyStatsLoading = useBalanceStore(state => state.isMonthlyStatsLoading)
  const monthlyStatsError = useBalanceStore(state => state.monthlyStatsError)
  const refreshAll = useBalanceStore(state => state.refreshAll)

  useEffect(() => {
    void refreshAll()
  }, [refreshAll])

  const navigate = useNavigate()

  return (
    <>
      <div className="mb-6 grid items-start gap-3">
        <div className="grid gap-3">
          {isBalanceLoading || !!balanceError || balance === null ? (
            <BalanceCardSkeleton isError={!!balanceError} message={balanceError?.message}/>
          ) : <BalanceCard balance={balance}/>}

          <div className="grid grid-cols-2 gap-3">
            {isMonthlyStatsLoading || !!monthlyStatsError || income === null ? (
              <MonthlyStatsCardSkeleton type="income" isError={!!monthlyStatsError} message={monthlyStatsError?.message}/>
            ) : <MonthlyStatsCard type="income" value={income}/>}

            {isMonthlyStatsLoading || !!monthlyStatsError || expenses === null ? (
              <MonthlyStatsCardSkeleton type="expenses" isError={!!monthlyStatsError} message={monthlyStatsError?.message}/>
            ) : <MonthlyStatsCard type="expenses" value={expenses}/>}
          </div>
        </div>

        <Button onClick={() => navigate("/add-transaction")}>Добавить транзакцию</Button>
        <TransactionsPanel/>
        <CategoriesPanel/>
      </div>

    </>
  )
}
