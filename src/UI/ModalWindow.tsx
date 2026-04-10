import {createPortal} from "react-dom"
import {useEffect} from "react"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

function ModalWindow({isOpen, onClose, children, className}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEsc)

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center`}
      onClick={onClose}
    >
      <div
        className={`relative bg-white rounded shadow-md ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3  text-gray-500 hover:text-black text-xl"
        >
          ×
        </button>

        {children}
      </div>
    </div>,
    document.body
  )
}

export default ModalWindow