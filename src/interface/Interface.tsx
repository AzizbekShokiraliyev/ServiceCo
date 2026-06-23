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
  title: string
  status: string
  client: string
}

export interface KanbanColumnProps {
  status: string
  deals: KanbanDeal[]
}

export interface KanbanCardProps {
  deal: KanbanDeal
}

export interface AboutUsDialogProps {
  children: React.ReactNode
}
