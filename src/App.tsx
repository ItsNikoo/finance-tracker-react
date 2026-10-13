import {useEffect} from "react"
import {ChartNoAxesCombined} from "lucide-react"
import BottomNavigation from "./components/BottomNavigation.tsx"
import {useNavigationStore, type AppSection} from "./stores/navigationStore.ts"
import TransactionsPanel from "./components/TransactionsPanel.tsx"
import CategoriesPanel from "./components/CategoriesPanel.tsx"
import TransactionForm from "./components/TransactionForm.tsx"
import BalanceCard from "./components/Cards/BalanceCard.tsx"
import MonthlyStatsCard from "./components/Cards/MonthlyStatsCard.tsx"
import LoginForm from "./components/LoginForm.tsx"
import RegisterForm from "./components/RegisterForm.tsx"
import ModalWindow from "./UI/ModalWindow.tsx"
import Button from "./UI/Button.tsx"
import {useModalWindowStore} from "./stores/modalWindowStore.ts"

import {useBalanceStore} from "./stores/balanceStore.ts"
import BalanceCardSkeleton from "./components/Cards/BalanceCardSkeleton.tsx"
import MonthlyStatsCardSkeleton from "./components/Cards/MonthlyStatsCardSkeleton.tsx"


function App() {
  const activeSection = useNavigationStore(state => state.activeSection)
  const setActiveSection = useNavigationStore(state => state.setActiveSection)
  const openModal = useModalWindowStore(state => state.openModal)
  const isModalOpen = useModalWindowStore(state => state.isModalOpen)
  const closeModal = useModalWindowStore(state => state.closeModal)

  const balance = useBalanceStore(state => state.balance)
  const income = useBalanceStore(state => state.income)
  const expenses = useBalanceStore(state => state.expenses)

  const isBalanceLoading = useBalanceStore(state => state.isBalanceLoading)
  const balanceError = useBalanceStore(state => state.balanceError)
  const isMonthlyStatsLoading = useBalanceStore(state => state.isMonthlyStatsLoading)
  const monthlyStatsError = useBalanceStore(state => state.monthlyStatsError)
  const refreshAll = useBalanceStore(state => state.refreshAll)
  const resetBalance = useBalanceStore(state => state.reset)

  useEffect(() => {
    void refreshAll()
    return resetBalance
  }, [refreshAll, resetBalance])

  function navigate(section: AppSection) {
    if (section === activeSection) return
    closeModal()
    setActiveSection(section)
    window.scrollTo({top: 0, behavior: "instant"})
  }

  return (
    <>
      <main className="app-content min-h-dvh bg-slate-50 px-4 pt-6 text-slate-900">
        <div className="mx-auto max-w-lg">
          <div hidden={activeSection !== "profile"}>
            <div className="grid items-start gap-6">
              <LoginForm/>
              <RegisterForm/>
            </div>
          </div>
          <div hidden={activeSection !== "home"}>
            <div className="mb-6 grid items-start gap-6">
              <div className="grid gap-3">
                {/*Плашка с общим балансом за месяц*/}
                {isBalanceLoading || !!balanceError || balance === null ? (
                  <BalanceCardSkeleton
                    isError={!!balanceError}
                    message={balanceError?.message}
                  />
                ) : (
                  <BalanceCard balance={balance}/>
                )}

                <div className="grid grid-cols-2 gap-3">

                  {/*Плашка с доходами */}
                  {isMonthlyStatsLoading || !!monthlyStatsError || income === null ? (
                    <MonthlyStatsCardSkeleton
                      type="income"
                      isError={!!monthlyStatsError}
                      message={monthlyStatsError?.message}
                    />
                  ) : (
                    <MonthlyStatsCard type="income" value={income}/>
                  )}

                  {/*Плашка с расходами*/}
                  {isMonthlyStatsLoading || !!monthlyStatsError || expenses === null ? (
                    <MonthlyStatsCardSkeleton
                      type="expenses"
                      isError={!!monthlyStatsError}
                      message={monthlyStatsError?.message}
                    />
                  ) : (
                    <MonthlyStatsCard type="expenses" value={expenses}/>
                  )}
                </div>
              </div>

              <Button onClick={openModal}>Добавить транзакцию</Button>
              <TransactionsPanel/>
              <CategoriesPanel/>
            </div>
          </div>
          {activeSection === "analytics" && (
            <section className="rounded-2xl border border-slate-200/80 bg-white px-6 py-12 text-center shadow-sm"
                     aria-label="Аналитика">
              <span
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <ChartNoAxesCombined size={28} aria-hidden="true"/>
              </span>
              <h2 className="text-lg font-semibold">Здесь будет ваша аналитика</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Графики и сводки доходов и расходов появятся в
                следующих обновлениях.</p>
            </section>
          )}
        </div>
      </main>
      <BottomNavigation activeSection={activeSection} onNavigate={navigate}/>
      <ModalWindow isOpen={isModalOpen} onClose={closeModal} title="Новая транзакция">
        <TransactionForm embedded/>
      </ModalWindow>
    </>
  )
}

export default App
