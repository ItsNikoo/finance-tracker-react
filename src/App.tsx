import {useLayoutEffect} from "react"
import {Navigate, Route, Routes, useLocation} from "react-router"
import BottomNavigation from "./components/BottomNavigation.tsx"
import MainPage from "./pages/MainPage.tsx"
import AnalyticsPage from "./pages/AnalyticsPage.tsx"
import ProfilePage from "./pages/ProfilePage.tsx"
import {useModalWindowStore} from "./stores/modalWindowStore.ts"
import AddTransactionPage from "./pages/AddTransactionPage.tsx"

export default function App() {
  const {pathname} = useLocation()
  const closeModal = useModalWindowStore(state => state.closeModal)

  useLayoutEffect(() => {
    closeModal()
    window.scrollTo({top: 0, behavior: "instant"})
  }, [pathname, closeModal])

  return (
    <>
      <main className="app-content min-h-dvh bg-slate-50 px-4 pt-6 text-slate-900">
        <div className="mx-auto max-w-lg">
          <Routes>
            <Route path="/" element={<MainPage/>} />
            <Route path="/add-transaction" element={<AddTransactionPage/>}/>
            <Route path="/analytics" element={<AnalyticsPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Routes>
        </div>
      </main>
      <BottomNavigation/>
    </>
  )
}
