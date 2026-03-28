import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning'
}

function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === 'default' && "bg-neutral-100 text-neutral-800",
        variant === 'primary' && "bg-primary-100 text-primary-700",
        variant === 'accent' && "bg-accent-100 text-accent-700",
        variant === 'success' && "bg-green-100 text-green-800",
        variant === 'warning' && "bg-amber-100 text-amber-800",
        className
      )}
      {...props}
    />
  )
}

export { Badge }