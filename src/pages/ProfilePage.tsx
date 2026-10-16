import LoginForm from "../components/LoginForm.tsx"
import RegisterForm from "../components/RegisterForm.tsx"

export default function ProfilePage() {
  return (
    <div className="grid items-start gap-6">
      <LoginForm/>
      <RegisterForm/>
    </div>
  )
}
