import {cardTitleClass, monthlyCardClass, monthlyValueClass} from "./cardStyles.ts"

type MonthlyStatsCardProps = {
  type: "income" | "expenses"
  value: number
}

const moneyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function MonthlyStatsCard({
                                           type,
                                           value,
                                         }: MonthlyStatsCardProps) {
  const title = type === "income" ? "Доходы" : "Расходы"

  return (
    <section
      className={`${monthlyCardClass} border-brand-500/70`}
      aria-label={title}
    >
      <p className={cardTitleClass}>
        {title}
      </p>

      <div className={monthlyValueClass}>
        <p className="w-full wrap-anywhere text-2xl leading-8 font-bold tabular-nums">
          {moneyFormatter.format(value)}
        </p>
      </div>
    </section>
  )
}
