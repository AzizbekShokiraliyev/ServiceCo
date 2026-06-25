import { Navigate, Outlet } from "react-router-dom"
import { useUserRole } from "@/hooks/useUserRole"
import type { ProfileRole } from "@/interface/Interface"

interface ProtectedRouteProps {
  allowedRoles: ProfileRole[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { role, loading } = useUserRole()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Yuklanmoqda...
      </div>
    )
  }

  if (!role) return <Navigate to="/login" replace />

  if (!allowedRoles.includes(role)) {
    const fallback =
      role === "admin"
        ? "/dashboard"
        : role === "technician"
          ? "/workers"
          : "/profile"
    return <Navigate to={fallback} replace />
  }

  return <Outlet />
}

export default ProtectedRoute

// YANGA QO'SHILGAN QISM: Bosh sahifa (/) uchun aqlli yo'naltirgich
export const RootRedirect = () => {
  const { role, loading } = useUserRole()

  if (loading) return null
  if (!role) return <Navigate to="/login" replace />

  const paths: Record<string, string> = {
    admin: "/dashboard",
    technician: "/workers",
    customer: "/profile",
  }

  return <Navigate to={paths[role] || "/login"} replace />
}
