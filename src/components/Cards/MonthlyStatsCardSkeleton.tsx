import {twMerge} from "tailwind-merge"
import {cardTitleClass, monthlyCardClass, monthlyCardColors, monthlyValueClass} from "./cardStyles.ts"

type MonthlyStatsCardSkeletonProps = {
  type: "income" | "expenses"
  isError: boolean
  message?: string
}

export default function MonthlyStatsCardSkeleton({type, isError, message}: MonthlyStatsCardSkeletonProps) {
  const title = type === "income" ? "Доходы" : "Расходы"
  const colors = monthlyCardColors[type]
  return (
    <section
      className={twMerge(monthlyCardClass, colors.frame, isError && "border-red-500/70")}
      aria-label={title}
      aria-busy={!isError}
    >
      <p className={twMerge(cardTitleClass, colors.text)}>{title}</p>

      <div className={monthlyValueClass}>
        {isError ? (
          <p role="alert" className="max-h-full w-full overflow-y-auto wrap-anywhere text-xs leading-4 font-semibold text-red-600">
            {message ?? "Ошибка загрузки данных"}
          </p>
        ) : (
          <div className={`h-8 w-32 max-w-full rounded-xl motion-safe:animate-pulse ${colors.placeholder}`} aria-hidden="true"/>
        )}
      </div>
    </section>
  )
}
