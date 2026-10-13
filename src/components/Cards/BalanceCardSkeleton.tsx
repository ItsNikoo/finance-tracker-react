import {balanceCardClass, balanceValueClass, cardTitleClass} from "./cardStyles.ts"

type BalanceCardSkeletonProps = {
  isError: boolean
  message?: string
}

export default function BalanceCardSkeleton({isError, message}: BalanceCardSkeletonProps) {
  return (
    <section
      className={`${balanceCardClass} ${isError ? "border-red-500/70" : "border-brand-500/70"}`}
      aria-labelledby="balance-title"
      aria-busy={!isError}
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
          {isError ? (
            <p role="alert" className="max-h-full w-full overflow-y-auto wrap-anywhere text-sm leading-5 font-semibold text-red-600">
              {message ?? "Ошибка загрузки баланса"}
            </p>
          ) : (
            <div className="h-8 w-40 max-w-full rounded-xl bg-brand-900/10 motion-safe:animate-pulse" aria-hidden="true"/>
          )}
        </div>
      </div>
    </section>
  )
}
