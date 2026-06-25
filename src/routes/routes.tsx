import { createBrowserRouter, Navigate } from "react-router-dom"
import AppLayout from "@/pages/AppLayout"
import Login from "@/components/auth/Login"
import Register from "@/components/auth/Register"
import Dashboard from "@/components/Admin/dashboard/Dashboard"
import Kanban from "@/components/Admin/kanban/Kanban"
import WorkersPage from "@/components/Workers/WorkersPage"
import ClientInfo from "@/components/Workers/clinetInfo/ClientInfo"
import User from "@/components/Users/User"
import ProtectedRoute from "./ProtectedRoute"
import MainLayout from "@/components/layout/MainLayout"

export const router = createBrowserRouter([
  { path: "/", element: <AppLayout /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    element: <MainLayout />,
    children: [
      // Admin
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/kanban", element: <Kanban /> },
        ],
      },
      // Technician
      {
        element: <ProtectedRoute allowedRoles={["technician"]} />,
        children: [
          { path: "/workers", element: <WorkersPage /> },
          { path: "/workers/client/:id", element: <ClientInfo /> },
        ],
      },
      // Customer
      {
        element: <ProtectedRoute allowedRoles={["customer"]} />,
        children: [{ path: "/profile", element: <User /> }],
      },
    ],
  },
  { path: "*", element: <Navigate to="/login" replace /> },
])

