import {useTransactions} from "./hooks/useTransactions.ts"
import {useCategories} from "./hooks/useCategories.ts"
import TransactionsPanel from "./components/TransactionsPanel.tsx"
import CategoriesPanel from "./components/CategoriesPanel.tsx"
import TransactionForm from "./components/TransactionForm.tsx"
import CategoryForm from "./components/CategoryForm.tsx"

function App() {
  const transactions = useTransactions()
  const categories = useCategories()
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-3xl bg-brand-900 p-6 text-white sm:p-9">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-200">Финансовый трекер</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Мои финансы</h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-brand-100 sm:text-base">Всё под контролем. Добавляйте операции и распределяйте их по категориям.</p>
        </header>
        <div className="mb-8 grid items-start gap-6 lg:grid-cols-2">
          <TransactionForm categoriesQuery={categories} onCreated={transactions.refetch}/>
          <CategoryForm onCreated={categories.refetch}/>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
          <TransactionsPanel query={transactions} categories={categories.data ?? []}/>
          <CategoriesPanel query={categories}/>
        </div>
      </div>
    </main>
  )
}

export default App
