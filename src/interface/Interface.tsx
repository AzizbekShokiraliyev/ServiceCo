import type { ReactNode } from "react"
import type React from "react"

export type TaskStatus = "Todo" | "In Progress" | "Done"
export type JobType = "electrical" | "plumbing" | "hvac"
export type JobStatus = "on_way" | "in_progress" | "completed"
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
  onDelete?: () => void
}

export type Skill = "Electrical" | "Plumbing" | "HVAC"

export interface Technician {
  id: string
  name: string
  skill: Skill
}

export interface DataTableColumn<T> {
  header: string
  className?: string
  cellClassName?: string
  render: (row: T) => React.ReactNode
}

export interface DataTableProps<T extends { id: string | number }> {
  columns: DataTableColumn<T>[]
  data?: T[]
  isLoading?: boolean
  isError?: boolean
  loadingText?: string
  errorText?: string
  emptyText?: string
  onRowClick?: (row: T) => void
  renderActions?: (row: T) => React.ReactNode
  actionsHeader?: string
}

export interface AboutUsDialogProps {
  children: React.ReactNode
}

export interface ConfirmDialogProps {
  trigger: ReactNode
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
}
