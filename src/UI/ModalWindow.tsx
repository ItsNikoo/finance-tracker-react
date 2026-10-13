import {createPortal} from "react-dom"
import {useEffect, useId, useRef, type ReactNode} from "react"
import {X} from "lucide-react"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

function ModalWindow({isOpen, onClose, title, children, className = ""}: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    dialogRef.current?.focus()

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
      if (e.key === "Tab") {
        const elements = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
        )
        const focusable = Array.from(elements ?? []).filter(element => element.getClientRects().length > 0)
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!first || !last) {
          e.preventDefault()
          return
        }
        if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener("keydown", handleEsc)

    return () => {
      window.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus({preventScroll: true})
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-[max(12px,env(safe-area-inset-top),env(safe-area-inset-bottom))]"
      onClick={event => {if (event.target === event.currentTarget) onClose()}}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`flex max-h-[calc(100dvh-max(12px,env(safe-area-inset-top),env(safe-area-inset-bottom))*2)] min-h-0 w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white text-slate-900 shadow-xl outline-none ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 py-2 pl-5 pr-2">
          <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
          <button
          type="button"
          aria-label="Закрыть модальное окно"
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          <X size={22} aria-hidden="true"/>
        </button>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain p-5">{children}</div>
      </div>
    </div>,
    document.body
  )
}

export default ModalWindow
