import type { ReactNode } from "react"
import type React from "react"

// ============ ENUMS / TYPES ============
export type ProfileRole = "admin" | "technician" | "customer"
export type Skill = "Electrical" | "Plumbing" | "HVAC"
export type JobType = "electrical" | "plumbing" | "hvac"
export type JobStatus = "on_way" | "in_progress" | "completed"

// ============ SUPABASE TABLES ============

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  role: ProfileRole
  created_at: string
}

export interface Technician {
  id: string
  profile_id: string | null
  full_name: string
  phone: string | null
  skill: Skill
  created_at: string
}

export interface Job {
  id: string
  title: string
  client_name: string | null
  client_phone: string | null
  address: string | null
  job_type: JobType | null
  status: JobStatus
  technician_id: string | null
  scheduled_start: string | null
  scheduled_end: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

// ============ JOINED TYPES ============

export interface JobWithTechnician extends Job {
  technician: Pick<Technician, "id" | "full_name" | "skill"> | null
}

export interface TechnicianWithProfile extends Technician {
  profile: Pick<Profile, "id" | "full_name" | "phone"> | null
}

// ============ KANBAN ============

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

// ============ SHARED COMPONENTS ============

export interface StatCardProps {
  title: string
  value: number | string
  subtext?: string
  icon: ReactNode
  iconColor?: string
  valueColor?: string
}

export interface ConfirmDialogProps {
  trigger: ReactNode
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
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