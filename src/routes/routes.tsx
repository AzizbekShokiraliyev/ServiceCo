import Login from "@/components/auth/Login"
import Register from "@/components/auth/Register"
import Dashboard from "@/components/Admin/dashboard/Dashboard"
import Kanban from "@/components/Admin/kanban/Kanban"
import MainLayout from "@/components/layout/MainLayout"
import AppLayout from "@/pages/AppLayout"
import { createBrowserRouter, Navigate } from "react-router-dom"

export const router = createBrowserRouter([
  { path: "/", element: <AppLayout /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    element: <MainLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/kanban", element: <Kanban /> },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
])
