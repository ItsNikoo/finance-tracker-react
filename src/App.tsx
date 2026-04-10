import RegisterForm from "./UI/RegisterForm.tsx"
import ModalWindow from "./UI/ModalWindow.tsx"
import Button from "./UI/Button.tsx"
import {useState} from "react"
import LoginForm from "./UI/LoginForm.tsx"

function App() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className=" flex flex-col gap-5 items-center justify-center">
      <Button
        onClick={() => setIsOpen(true)}
        variant={"primary"}>Зарегистрироваться</Button>
      <ModalWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <RegisterForm/>
      </ModalWindow>
      <LoginForm />
    </div>
  )
}

export default App
