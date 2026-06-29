import { Navigate } from "react-router-dom"
import { useUserRole } from "@/hooks/useUserRole"
import LayoutHeader from "./LayoutHeader"
import LayoutMain from "./LayoutMain"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"

const AppLayout = () => {
  const { role, loading } = useUserRole()

  if (loading) {
    return <LoadingSpinner />
  }

  if (role) {
    const paths: Record<string, string> = {
      admin: "/dashboard",
      technician: "/workers",
      customer: "/profile",
    }
    return <Navigate to={paths[role] || "/login"} replace />
  }

  return (
    <div>
      <LayoutHeader />
      <LayoutMain />
    </div>
  )
}

export default AppLayout
