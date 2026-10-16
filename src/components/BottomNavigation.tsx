import {ChartNoAxesCombined, House, UserRound} from "lucide-react"
import {NavLink} from "react-router"

const items = [
  {path: "/", label: "Главная", icon: House},
  {path: "/analytics", label: "Аналитика", icon: ChartNoAxesCombined},
  {path: "/profile", label: "Профиль", icon: UserRound},
] as const

export default function BottomNavigation() {
  return (
    <nav className="bottom-navigation" aria-label="Основная навигация">
      <div className="mx-auto grid h-full max-w-lg grid-cols-3 px-4 py-1">
        {items.map(({path, label, icon: Icon}) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({isActive}) => `flex min-w-0 touch-manipulation flex-col items-center justify-center gap-1 rounded-2xl text-xs font-medium motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${isActive ? "text-brand-600" : "text-slate-500 hover:text-brand-600"}`}
          >
            {({isActive}) => (
              <>
                <span className={`flex h-8 w-14 items-center justify-center rounded-full motion-safe:transition-colors ${isActive ? "bg-brand-100" : "bg-transparent"}`}>
                  <Icon size={23} strokeWidth={isActive ? 2.25 : 1.75} aria-hidden="true"/>
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
