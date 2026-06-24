import { createContext } from "react"
import type { LucideIcon } from "lucide-react"

export type Status = "onWay" | "started" | "finished"

export interface Task {
  id: number
  title: string
  address: string
  phone: string
  time: string
  status: Status
  icon: LucideIcon
  iconColor: string
  iconBg: string
}

export interface TasksContextType {
  tasks: Task[]
  completedCount: number
  totalCount: number
  getTask: (id: number) => Task | undefined
  updateStatus: (id: number, status: Status) => void
  finishTask: (id: number) => void
}

// Only the context lives here — no components, no ESLint warning
export const TasksContext = createContext<TasksContextType | null>(null)
