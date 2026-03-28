import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
}>({
  value: '',
  onValueChange: () => {}
})

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-neutral-100 p-1 text-neutral-500",
        className
      )}
      {...props}
    />
  )
})
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  const isActive = context.value === value

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-white text-neutral-900 shadow-sm" : "hover:bg-neutral-50",
        className
      )}
      onClick={() => context.onValueChange(value)}
      {...props}
    />
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  
  if (context.value !== value) return null

  return (
    <div
      ref={ref}
      className={cn("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500", className)}
      {...props}
    />
  )
})
TabsContent.displayName = "TabsContent"

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

const Tabs = React.forwardRef<
  HTMLDivElement,
  TabsProps & React.HTMLAttributes<HTMLDivElement>
>(({ value, onValueChange, children, className, ...props }, ref) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
})
Tabs.displayName = "Tabs"

export { Tabs, TabsList, TabsTrigger, TabsContent }