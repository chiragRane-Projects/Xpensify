"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ThemeButton() {
  const { setTheme, theme } = useTheme()
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "relative overflow-hidden group focus:ring-2 focus:ring-offset-2 focus:ring-primary",
            "border-gray-800",
            isMounted && theme === "dark" ? "bg-gray-900 hover:bg-gray-800" : "bg-background hover:bg-gray-100"
          )}
          title="Toggle theme"
        >
          <Sun
            className={cn(
              "h-[1.2rem] w-[1.2rem] transition-all duration-300 ease-in-out",
              "rotate-0 scale-100 group-hover:scale-110",
              isMounted && theme === "dark" ? "-rotate-90 scale-0" : "",
              "text-black"
            )}
          />
          <Moon
            className={cn(
              "absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ease-in-out",
              "rotate-90 scale-0 group-hover:scale-110",
              isMounted && theme === "dark" ? "rotate-0 scale-100" : "",
              "text-black"
            )}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[8rem] bg-background/95 backdrop-blur-sm shadow-xl"
      >
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Theme
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 transition-colors"
        >
          <Sun className="h-4 w-4 text-black" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 transition-colors"
        >
          <Moon className="h-4 w-4 text-black" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 transition-colors"
        >
          <Monitor className="h-4 w-4 text-black" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}