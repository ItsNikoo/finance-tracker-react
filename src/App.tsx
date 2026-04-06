import RegisterForm from "./UI/RegisterForm.tsx";
import ModalWindow from "./UI/ModalWindow.tsx";
import Button from "./UI/Button.tsx";
import {useState} from "react";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className=" flex items-center justify-center">
      <Button
        onClick={() => setIsOpen(true)}
        variant={"primary"}>Зарегистрироваться</Button>
      <ModalWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <RegisterForm/>
      </ModalWindow>
    </div>
  )
}

export default App
