import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111110] dark:focus-visible:ring-[#FDFCF8] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-[#111110] dark:bg-[#FDFCF8] text-[#FDFCF8] dark:text-[#111110] hover:bg-[#2A2A28] dark:hover:bg-[#EAE6D7] shadow-sm": variant === "default",
            "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/50": variant === "destructive",
            "border border-[#D9D7CE] dark:border-[#333333] bg-transparent hover:bg-[#F2EFE5] dark:hover:bg-[#27272A] text-[#111110] dark:text-[#FDFCF8]": variant === "outline",
            "bg-[#F2EFE5] dark:bg-[#27272A] text-[#111110] dark:text-[#FDFCF8] hover:bg-[#EAE6D7] dark:hover:bg-[#3F3F46]": variant === "secondary",
            "hover:bg-[#F2EFE5] dark:hover:bg-[#27272A] text-[#555550] dark:text-[#A1A1AA] hover:text-[#111110] dark:hover:text-[#FDFCF8]": variant === "ghost",
            "text-[#111110] dark:text-[#FDFCF8] underline-offset-4 hover:underline": variant === "link",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-12 rounded-lg px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
