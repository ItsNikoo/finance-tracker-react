import {twMerge} from "tailwind-merge"
import {cardTitleClass, monthlyCardClass, monthlyCardColors, monthlyValueClass} from "./cardStyles.ts"

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
  const colors = monthlyCardColors[type]

  return (
    <section
      className={`${monthlyCardClass} ${colors.frame}`}
      aria-label={title}
    >
      <p className={twMerge(cardTitleClass, colors.text)}>
        {title}
      </p>

      <div className={monthlyValueClass}>
        <p className={`w-full wrap-anywhere text-2xl leading-8 font-bold tabular-nums ${colors.text}`}>
          {moneyFormatter.format(value)}
        </p>
      </div>
    </section>
  )
}
