import {cardTitleClass, monthlyCardClass, monthlyValueClass} from "./cardStyles.ts"

type MonthlyStatsCardSkeletonProps = {
  type: "income" | "expenses"
  isError: boolean
  message?: string
}

export default function MonthlyStatsCardSkeleton({type, isError, message}: MonthlyStatsCardSkeletonProps) {
  const title = type === "income" ? "Доходы" : "Расходы"
  return (
    <section
      className={`${monthlyCardClass} ${isError ? "border-red-500/70" : "border-brand-500/70"}`}
      aria-label={title}
      aria-busy={!isError}
    >
      <p className={cardTitleClass}>{title}</p>

      <div className={monthlyValueClass}>
        {isError ? (
          <p role="alert" className="max-h-full w-full overflow-y-auto wrap-anywhere text-xs leading-4 font-semibold text-red-600">
            {message ?? "Ошибка загрузки данных"}
          </p>
        ) : (
          <div className="h-8 w-32 max-w-full rounded-xl bg-brand-900/10 motion-safe:animate-pulse" aria-hidden="true"/>
        )}
      </div>
    </section>
  )
}
