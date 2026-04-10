import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

function Button({variant = "primary", className, children, ...props}: ButtonProps) {
  return (
    <button
      type="button"
      className={twMerge(clsx(
        "p-3 text-md rounded-xl transition ease-in-out duration-250 cursor-pointer",
        {
          "bg-brand-500 text-white hover:bg-brand-700 disabled:bg-brand-300/50 disabled:cursor-not-allowed":
            variant === "primary",
          "bg-mygray text-black hover:bg-mygray-hovered":
            variant === "secondary",
        },
        className
      ))}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button