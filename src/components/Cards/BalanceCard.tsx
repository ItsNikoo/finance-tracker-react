import {balanceCardClass, balanceValueClass, cardTitleClass} from "./cardStyles.ts"

type BalanceCardProps = {
  balance: number
}

const balanceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function BalanceCard({balance}: BalanceCardProps) {
  return (
    <section
      className={`${balanceCardClass} border-brand-500/70`}
      aria-labelledby="balance-title"
    >
      <div
        className="
          pointer-events-none absolute -right-12 -top-12
          h-40 w-40 rounded-full
          bg-lime-200/20 blur-3xl
        "
        aria-hidden="true"
      />

      <div className="relative">
        <p
          id="balance-title"
          className={cardTitleClass}
        >
          Общий баланс
        </p>

        <div className={balanceValueClass}>
          <p className="w-full wrap-anywhere text-[clamp(1.5rem,7vw,2rem)] leading-8 font-bold tracking-tight text-slate-900 tabular-nums">
            {balanceFormatter.format(balance)}
          </p>
        </div>
      </div>
    </section>
  )
}
