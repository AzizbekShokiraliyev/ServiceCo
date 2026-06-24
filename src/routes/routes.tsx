import Login from "@/components/auth/Login"
import Register from "@/components/auth/Register"
import Dashboard from "@/components/Admin/dashboard/Dashboard"
import Kanban from "@/components/Admin/kanban/Kanban"
import MainLayout from "@/components/layout/MainLayout"
import AppLayout from "@/pages/AppLayout"
import { createBrowserRouter, Navigate } from "react-router-dom"
import WorkersPage from "@/components/Workers/WorkersPage"
import User from "@/components/Users/User"
import ClientInfo from "@/components/Workers/clinetInfo/ClientInfo"

export const router = createBrowserRouter([
  { path: "/", element: <AppLayout /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    element: <MainLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/kanban", element: <Kanban /> },
      { path: "/workers", element: <WorkersPage /> },
      { path: "/profile", element: <User /> },

      // Yangi dinamik yo'l
      { path: "/client/:id", element: <ClientInfo /> },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
])
