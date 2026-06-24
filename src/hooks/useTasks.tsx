import { TasksContext } from "@/components/Workers/clinetInfo/TasksContext"
import { useContext } from "react"

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) {
    throw new Error("useTasks must be used inside a <TasksProvider>")
  }
  return ctx
}
