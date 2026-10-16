import {ArrowLeft} from "lucide-react"
import {useNavigate} from "react-router"
import TransactionForm from "../components/TransactionForm.tsx"
import Button from "../UI/Button.tsx"

export default function AddTransactionPage() {
  const navigate = useNavigate()

  return (
    <div className="grid min-w-0 gap-4">
      <Button
        variant="secondary"
        className="inline-flex items-center gap-2 justify-self-start"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} aria-hidden="true"/>
        Назад
      </Button>
      <TransactionForm/>
    </div>
  )
}
