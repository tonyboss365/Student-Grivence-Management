import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-[#E5E3D9] dark:border-[#333333] bg-white/50 dark:bg-[#18181B]/50 px-4 py-2 text-base text-[#111110] dark:text-[#FDFCF8] placeholder:text-[#888880] dark:placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#111110] dark:focus-visible:ring-[#FDFCF8] focus-visible:border-[#111110] dark:focus-visible:border-[#FDFCF8] transition-all duration-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
