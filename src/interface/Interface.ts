import type { ReactNode } from "react"
import type React from "react"

export type TaskStatus = "Todo" | "In Progress" | "Done"
export type ClientDealStatus = "new" | "in_progress" | "won" | "lost"
export type ProfileRole = 'admin' | 'technician' | 'customer';
export type Skill = 'Electrical' | 'Plumbing' | 'HVAC';
export type JobType = 'electrical' | 'plumbing' | 'hvac'
export type JobStatus = 'on_way' | 'in_progress' | 'completed'

export interface Profile {
  id: string;
  full_name: string | null;
  role: ProfileRole;
  created_at: string;
  updated_at: string;
}

export interface Technician {
  id: string;
  profile_id: string | null;
  name: string;
  skill: Skill;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  client_id: string | null;
  client_name: string;
  email: string | null;
  location: string;
  title: string;
  job_type: JobType;
  job_status: JobStatus;
  technician_id: string | null;
  start_time: string | null;
  end_time: string | null;
  duration_estimate: string | null;
  created_at: string;
  updated_at: string;
}


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
