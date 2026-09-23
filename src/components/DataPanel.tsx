import type {ReactNode} from "react"
import Button from "../UI/Button.tsx"

interface DataPanelProps {
  title: string,
  isLoading: boolean,
  isError: boolean,
  isEmpty: boolean,
  emptyMessage: string,
  refetch: () => void,
  children: ReactNode,
}

export default function DataPanel({
                                    title,
                                    isLoading,
                                    isError,
                                    isEmpty,
                                    emptyMessage,
                                    refetch,
                                    children
                                  }: DataPanelProps) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6" aria-label={title}
             aria-busy={isLoading}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button variant="secondary" className="px-3 py-2 text-sm" onClick={refetch}
                disabled={isLoading}>Обновить</Button>
      </div>
      {isLoading ? (
        <div role="status" className="space-y-3">
          <span className="sr-only">Загрузка: {title}</span>
          {[0, 1, 2, 3].map(index => (
            <div key={index} aria-hidden="true" className="h-16 rounded-xl bg-slate-100 motion-safe:animate-pulse"/>
          ))}
        </div>
      ) : isError ? (
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <p className="mb-3">Не удалось загрузить данные. Попробуйте ещё раз.</p>
          <Button variant="secondary" onClick={refetch}>Повторить</Button>
        </div>
      ) : isEmpty ? (
        <p
          className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">{emptyMessage}</p>
      ) : children}
    </section>
  )
}
