import * as React from "react"
import { PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../button"
import { useSidebar } from "./sidebar-context"

export const SidebarTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn("inline-flex", className)}
      onClick={(e) => {
        onClick?.(e)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </div>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"