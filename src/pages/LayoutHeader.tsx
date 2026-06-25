"use client"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useUserRole } from "@/hooks/useUserRole"
import { supabase } from "@/lib/supaBase"

const LayoutHeader = () => {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  const { role, loading } = useUserRole()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  const getCabinetPath = () => {
    if (role === "admin") return "/dashboard"
    if (role === "technician") return "/workers"
    return "/profile"
  }

  const getCabinetLabel = () => {
    if (role === "admin") return "Dashboard"
    if (role === "technician") return "Ishlarim"
    return "Mening profilim"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="text-xl font-bold tracking-tight text-primary">
          ServiceCo
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Sun /> : <Moon />}
          </Button>

          {!loading && (
            role ? (
              <>
                <Link to={getCabinetPath()}>
                  <Button variant="outline" size="lg">
                    {getCabinetLabel()}
                  </Button>
                </Link>
                <Button size="lg" onClick={handleLogout}>
                  Chiqish
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg">Register</Button>
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  )
}

export default LayoutHeader

