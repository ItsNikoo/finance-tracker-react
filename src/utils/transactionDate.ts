import type {Transaction} from "../types.ts"

const inputFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Moscow",
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
  hourCycle: "h23",
})

const displayFormatter = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow",
  day: "2-digit", month: "short", year: "numeric",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
  hourCycle: "h23",
})

export function getMoscowDateTime(date = new Date()) {
  const parts = Object.fromEntries(inputFormatter.formatToParts(date).map(part => [part.type, part.value]))
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
  }
}

export function moscowDateTimeToIso(date: string, time: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}(:\d{2})?$/.test(time)) return null
  const fullTime = time.length === 5 ? `${time}:00` : time
  const parsed = new Date(`${date}T${fullTime}+03:00`)
  if (!Number.isFinite(parsed.getTime())) return null
  const roundTrip = getMoscowDateTime(parsed)
  if (roundTrip.date !== date || roundTrip.time !== fullTime) return null
  return parsed.toISOString()
}

export function getTransactionDate(transaction: Transaction): string | null {
  for (const value of [transaction.occurred_at, transaction.created_at]) {
    if (value && Number.isFinite(Date.parse(value))) return value
  }
  return null
}

export function formatTransactionDate(value: string | null) {
  return value ? displayFormatter.format(new Date(value)) : "Дата не указана"
}

export function sortTransactionsNewestFirst(transactions: readonly Transaction[]): Transaction[] {
  const timestamp = (transaction: Transaction) => {
    const date = getTransactionDate(transaction)
    return date ? Date.parse(date) : -Infinity
  }
  return [...transactions].sort((a, b) => timestamp(b) - timestamp(a) || b.id - a.id)
}
