import { useState, type ReactNode } from "react"
import { Zap, Droplets, Wrench } from "lucide-react"
import { TasksContext, type Task, type Status } from "./TasksContext"

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "Ofis simlarini ta'mirlash",
    address: "42 Amir Temur",
    phone: "+998901234567",
    time: "8:00 - 10:00",
    status: "onWay",
    icon: Zap,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    id: 2,
    title: "Quvur sizishi",
    address: "3 Yunusobod",
    phone: "+998901234567",
    time: "8:00 - 10:00",
    status: "onWay",
    icon: Droplets,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    id: 3,
    title: "Eshik o'rnatish",
    address: "17 Chilonzor",
    phone: "+998901234567",
    time: "8:00 - 10:00",
    status: "onWay",
    icon: Wrench,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
]

// Only the provider component lives here — satisfies react-refresh/only-export-components
export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [completedCount, setCompletedCount] = useState(0)

  const totalCount = tasks.length + completedCount

  const getTask = (id: number) => tasks.find((t) => t.id === id)

  const updateStatus = (id: number, status: Status) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))

  const finishTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    setCompletedCount((c) => c + 1)
  }

  return (
    <TasksContext.Provider
      value={{
        tasks,
        completedCount,
        totalCount,
        getTask,
        updateStatus,
        finishTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}
