import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import type React from "react"

export type ProfileRole = "admin" | "technician" | "customer"
export type Skill = "Electrical" | "Plumbing" | "HVAC"
export type JobType = "electrical" | "plumbing" | "hvac"
export type SickReportStatus = "pending" | "reviewed"

// Boshqa statuslar qatoriga "rejected" qo'shildi 👇
export type JobStatus = "pending" | "on_way" | "in_progress" | "completed" | "rejected"

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  role: ProfileRole
  created_at: string
}

export interface Technician {
  id: string
  full_name: string
  skill: Skill
  phone?: string
  description?: string
  created_at?: string
  profile_id?: string
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

export interface JobWithTechnician extends Job {
  technician: Pick<Technician, "id" | "full_name" | "skill"> | null
}

export interface TechnicianWithProfile extends Technician {
  profile: Pick<Profile, "id" | "full_name" | "phone"> | null
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
  editable?: boolean
}

export interface KanbanColumnProps {
  status: string
  label?: string         
  heightClass?: string
  widthClass?: string
  emptyText?: string
  emptyVariant?: "drop" | "info"
  subtitle?: string
  isDropDisabled?: boolean
}

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
  variant?: "default" | "destructive"
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

export interface TimelineRow {
  id: string
  label: string
  sublabel?: string
  avatarChar?: string
  isSick?: boolean
  sickReason?: string
}

export interface TimelineEvent {
  id: string
  rowId: string
  title: string
  subtitle?: string
  startTime: string
  endTime: string
}

export interface PositionedEvent extends TimelineEvent {
  laneIndex: number
  laneCount: number
}

export interface TimelineProps {
  rows: TimelineRow[]
  events: TimelineEvent[]
  height?: string
  readOnly?: boolean
  onEventMove?: (id: string, startTime: string, endTime: string) => void
  onEventRemove?: (id: string) => void
  onEventRowChange?: (id: string, newRowId: string) => void
}

export interface TimelineGridRowProps {
  row: TimelineRow
  rows: TimelineRow[]
  positionedEvents: PositionedEvent[]
  dynamicHeight: number
  readOnly?: boolean
  onEventMove?: (id: string, startTime: string, endTime: string) => void
  onEventRemove?: (id: string) => void
  onEventRowChange?: (id: string, newRowId: string) => void
}

export interface InfoListItemProps {
  icon: React.ElementType
  iconBg?: string
  iconColor?: string
  title: string
  subtitle?: React.ReactNode
  duration?: string
  statusLabel?: string
  statusClassName?: string
  onClick?: () => void
}

export interface ListContainerProps {
  title: string
  description?: string
  headerAction?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export interface TabOption {
  value: string
  label: string
}

export interface SearchBarProps {
  tabs?: TabOption[]
  activeTab?: string
  onTabChange?: (value: string) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
}

export interface SharedStatCardProps {
  title: string
  value: number | string
  subtext?: string
  icon: LucideIcon
  iconColor?: string
  valueColor?: string
}

export interface JobStatusConfig {
  label: string
  className: string
}

export interface JobTypeConfig {
  label: string
  icon: LucideIcon
  bg: string
  text: string
}

export interface TimelineTimeEditDialogProps {
  event: TimelineEvent
  rows: TimelineRow[]
  onSave: (startTime: string, endTime: string) => void
  onRowChange?: (newRowId: string) => void
}

export interface PendingAssign {
  dealId: string
  technicianId: string
  technicianName: string
}

export interface TimelineBlockProps {
  event: PositionedEvent
  rows?: TimelineRow[]
  readOnly?: boolean
  onMove?: (id: string, startTime: string, endTime: string) => void
  onRemove?: (id: string) => void
  onRowChange?: (id: string, newRowId: string) => void
}

export interface TimelineCardProps {
  deal: KanbanDeal
  isOverlay?: boolean
}

export interface SickReport {
  id: string
  technician_id: string
  reason: string
  status: SickReportStatus
  created_at: string
}

export interface ReportSickDialogProps {
  technicianId?: string
}