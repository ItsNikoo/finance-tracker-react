const cardClass = "relative min-w-0 overflow-hidden border shadow-[0_8px_30px_rgba(30,50,20,0.05)]"

export const balanceCardClass = `${cardClass} bg-linear-to-br from-white via-brand-50 to-white rounded-[30px] px-5 py-5 sm:px-6`
export const monthlyCardClass = `${cardClass} rounded-[20px] px-4 py-4`
export const cardTitleClass = "h-5 text-sm leading-5 font-medium text-slate-500"
export const balanceValueClass = "mt-3 flex h-16 min-w-0 items-center"
export const monthlyValueClass = "mt-1 flex h-16 min-w-0 items-center"

export const monthlyCardColors = {
  income: {frame: "border-brand-200 bg-brand-50", text: "text-brand-700", placeholder: "bg-brand-200/70"},
  expenses: {frame: "border-rose-200 bg-rose-50", text: "text-rose-700", placeholder: "bg-rose-200/70"},
} as const
