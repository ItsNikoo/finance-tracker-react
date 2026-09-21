import type {Category} from "../types.ts"
import DataPanel, {type ListQuery} from "./DataPanel.tsx"

export default function CategoriesPanel({query}: {query: ListQuery<Category>}) {
  const categories = query.data ?? []
  return (
    <DataPanel title="Категории" {...query} isEmpty={categories.length === 0} emptyMessage="Категорий пока нет">
      <ul className="space-y-2">
        {categories.map(category => (
          <li key={category.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:bg-white">
            <span aria-hidden="true" className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${category.type === "income" ? "bg-brand-100 text-brand-700" : "bg-orange-50 text-orange-700"}`}>{category.type === "income" ? "+" : "−"}</span>
            <div className="min-w-0">
              <p className="wrap-break-word text-sm font-medium">{category.name_ru || category.name_en}</p>
              <p className="mt-1 text-xs text-slate-500">{category.type === "income" ? "Доход" : "Расход"}</p>
            </div>
          </li>
        ))}
      </ul>
    </DataPanel>
  )
}
