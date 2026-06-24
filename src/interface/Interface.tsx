import type { ReactNode } from "react"

export type TaskStatus = "Todo" | "In Progress" | "Done"
export type JobType = "electrical" | "plumbing" | "hvac"
export type JobStatus = "pending" | "in_progress" | "completed"
export type ClientDealStatus = "new" | "in_progress" | "won" | "lost"

export interface StatCardProps {
  title: string
  value: number
  icon: ReactNode
}

export interface KanbanDeal {
  id: string
  client: string
  title: string
  status: string
  startTime?: string
  endTime?: string
}

export interface KanbanCardProps {
  deal: KanbanDeal
  onTimeChange?: (id: string, startTime: string, endTime: string) => void
}

export interface KanbanColumnProps {
  status: string
  deals: KanbanDeal[]
  heightClass?: string
  widthClass?: string
  emptyText?: string
  emptyVariant?: "drop" | "info"
  subtitle?: string
  isDropDisabled?: boolean
  onTimeChange?: (id: string, startTime: string, endTime: string) => void
}

export interface AboutUsDialogProps {
  children: React.ReactNode
}
