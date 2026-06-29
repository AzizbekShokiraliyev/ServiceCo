import {
  Sidebar as MainSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "../ui/sidebar"
import {
  LayoutDashboard,
  KanbanSquare,
  LogOut,
  ChevronRight,
  User,
  Users,
} from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useUserRole } from "@/hooks/useUserRole"
import { supabase } from "@/lib/supaBase"
import { useQueryClient } from "@tanstack/react-query"

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Kanban", path: "/kanban", icon: KanbanSquare },
  { label: "Masters", path: "/masters", icon: Users },
  { label: "Ishlarim", path: "/workers", icon: User },
  { label: "Buyurtmalarim", path: "/profile", icon: User },
]

const Sidebar = () => {
  const { role, loading } = useUserRole()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    try {
      supabase.auth.signOut()
    } catch (error) {
      console.error(error)
    } finally {
      queryClient.clear()
      navigate("/login")
    }
  }

  const filteredItems = navItems.filter((item) => {
    if (role === "admin") {
      return (
        item.path === "/dashboard" ||
        item.path === "/kanban" ||
        item.path === "/masters"
      )
    }
    if (role === "technician") {
      return item.path === "/workers"
    }
    if (role === "customer") {
      return item.path === "/profile"
    }
    return false
  })

  return (
    <div className="w-64 border-none">
      <MainSidebar>
        <SidebarHeader>
          <div className="px-5 py-6">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-black shadow-lg dark:bg-white">
                <span className="text-sm font-black text-white dark:text-black">
                  SC
                </span>
              </div>
              <div>
                <p className="text-sm leading-none font-bold">ServiceCo</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Pro workspace
                </p>
              </div>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <div className="px-3">
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.15em] text-muted-foreground/60 uppercase">
              Workspace
            </p>

            <SidebarMenu>
              {loading ? (
                <div className="space-y-2.5 px-3 py-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-9 w-full animate-pulse rounded-xl bg-muted/60"
                    />
                  ))}
                </div>
              ) : (
                filteredItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild className="h-auto p-0">
                      <NavLink to={item.path}>
                        {({ isActive }) => (
                          <div
                            className={`group relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${isActive ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"}`}
                          >
                            {isActive && (
                              <div className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-background/40" />
                            )}

                            <div
                              className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                                isActive
                                  ? "bg-background/15"
                                  : "bg-muted group-hover:bg-background"
                              } `}
                            >
                              <item.icon className="h-3.5 w-3.5" />
                            </div>

                            <span className="flex-1 text-sm font-medium">
                              {item.label}
                            </span>

                            <ChevronRight
                              className={`h-3.5 w-3.5 transition-all duration-200 ${isActive ? "opacity-60" : "opacity-0 group-hover:opacity-40"} `}
                            />
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </div>
        </SidebarContent>

        <SidebarFooter>
          <div
            onClick={handleLogout}
            className="mx-1 cursor-pointer rounded-xl border border-border/50 bg-muted/30 p-3 transition-all duration-200 hover:bg-muted/60"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="truncate text-sm leading-none font-semibold">
                Tizimdan chiqish
              </p>
              <Button>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SidebarFooter>
      </MainSidebar>
    </div>
  )
}

export default Sidebar
