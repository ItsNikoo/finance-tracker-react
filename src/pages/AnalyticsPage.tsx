import {ChartNoAxesCombined} from "lucide-react"

export default function AnalyticsPage() {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white px-6 py-12 text-center shadow-sm"
             aria-label="Аналитика">
      <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <ChartNoAxesCombined size={28} aria-hidden="true"/>
      </span>
      <h2 className="text-lg font-semibold">Здесь будет ваша аналитика</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">Графики и сводки доходов и расходов появятся в
        следующих обновлениях.</p>
    </section>
  )
}
