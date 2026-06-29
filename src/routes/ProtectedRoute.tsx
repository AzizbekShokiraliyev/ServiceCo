import { Navigate, Outlet } from "react-router-dom"
import { useUserRole } from "@/hooks/useUserRole"
import type { ProfileRole } from "@/interface/Interface"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"

interface ProtectedRouteProps {
  allowedRoles: ProfileRole[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { role, loading } = useUserRole()

  if (loading) {
    return <LoadingSpinner />
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
