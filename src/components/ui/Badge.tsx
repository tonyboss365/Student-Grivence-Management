import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-[#111110] dark:bg-[#FDFCF8] text-[#FDFCF8] dark:text-[#111110]": variant === "default",
          "border-transparent bg-[#F2EFE5] dark:bg-[#27272A] text-[#111110] dark:text-[#FDFCF8]": variant === "secondary",
          "border-transparent bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400": variant === "destructive",
          "border-transparent bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400": variant === "success",
          "border-transparent bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400": variant === "warning",
          "text-[#111110] dark:text-[#FDFCF8] border-[#E5E3D9] dark:border-[#333333] bg-white dark:bg-[#18181B]": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
