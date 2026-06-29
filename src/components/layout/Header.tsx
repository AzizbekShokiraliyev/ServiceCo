"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { useUserRole } from "@/hooks/useUserRole"
import { useProfile } from "@/hooks/useProfile"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const Header = () => {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const { role, loading } = useUserRole()
  const { data: profile } = useProfile()

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="text-xl font-bold tracking-tight text-primary">
          ServiceCo
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {!loading && role && (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border select-none">
                <AvatarFallback className="bg-primary font-medium text-primary-foreground">
                  {profile?.full_name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
