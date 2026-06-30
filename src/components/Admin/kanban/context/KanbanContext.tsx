/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"
import {
  useTechnicians,
  useTechnicianCreate,
  useTechnicianDelete,
  useTechnicianUpdate,
} from "@/hooks/useTechnicians"
import { useJobs, useJobUpdate } from "@/hooks/useJobs"
import type {
  KanbanDeal,
  PendingAssign,
  Skill,
  Technician,
} from "@/interface/Interface"
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core"
import { SKILL_FILTERS } from "../constants/kanbanConstants"
import { toast } from "sonner"
import { useSickTechnicianIdsToday } from "@/hooks/Usesickreports"
export type ViewMode = "kanban" | "timeline"

interface KanbanContextType {
  activeDeal: KanbanDeal | null
  setActiveDeal: React.Dispatch<React.SetStateAction<KanbanDeal | null>>
  skillFilter: (typeof SKILL_FILTERS)[number]
  setSkillFilter: React.Dispatch<
    React.SetStateAction<(typeof SKILL_FILTERS)[number]>
  >
  viewMode: ViewMode
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>

  pendingAssign: PendingAssign | null
  setPendingAssign: React.Dispatch<React.SetStateAction<PendingAssign | null>>
  pendingStart: string
  setPendingStart: (value: string) => void
  pendingEnd: string
  setPendingEnd: (value: string) => void
  pendingError: string
  setPendingError: (value: string) => void

  technicians: Technician[]
  visibleTechnicians: Technician[]
  deals: KanbanDeal[]
  unassignedDeals: KanbanDeal[]
  techLoading: boolean
  jobsLoading: boolean
  sickTechnicianIds: Map<string, string>

  // Mutations
  createTechnician: (variables: { full_name: string; skill: Skill }) => void
  updateTechnician: (variables: {
    id: string
    full_name: string
    skill: Skill
  }) => void // qo'shildi
  deleteTechnician: (id: string) => void

  // Handlers
  handleTimeChange: (id: string, start: string, end: string) => void
  handleRowChange: (id: string, newRowId: string) => void
  handleRemoveFromTimeline: (id: string) => void
  handleDragStart: (event: DragStartEvent) => void
  handleDragEnd: (event: DragEndEvent) => void
  confirmPendingAssign: () => void
  cancelPendingAssign: () => void
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined)

export function KanbanProvider({ children }: { children: ReactNode }) {
  const [activeDeal, setActiveDeal] = useState<KanbanDeal | null>(null)
  const [skillFilter, setSkillFilter] =
    useState<(typeof SKILL_FILTERS)[number]>("Barchasi")
  const [viewMode, setViewMode] = useState<ViewMode>("kanban")

  const [pendingAssign, setPendingAssign] = useState<PendingAssign | null>(null)
  const [pendingStart, setPendingStart] = useState("")
  const [pendingEnd, setPendingEnd] = useState("")
  const [pendingError, setPendingError] = useState("")

  const { data: techniciansData = [], isLoading: techLoading } =
    useTechnicians()
  const { data: jobsData = [], isLoading: jobsLoading } = useJobs()
  const { mutate: createTechnician } = useTechnicianCreate()
  const { mutate: updateTechnician } = useTechnicianUpdate()
  const { mutate: deleteTechnician } = useTechnicianDelete()
  const { data: sickTechnicianIds = new Map<string, string>() } =
    useSickTechnicianIdsToday()
  const { mutate: updateJob } = useJobUpdate()

  const technicians = techniciansData

  const deals: KanbanDeal[] = jobsData
    .filter((job) => job.status !== "completed")
    .map((job) => ({
      id: job.id,
      client: job.client_name ?? "Noma'lum",
      title: job.title,
      status: job.technician?.full_name ?? "Works",
      startTime: job.scheduled_start ?? undefined,
      endTime: job.scheduled_end ?? undefined,
    }))

  const visibleTechnicians =
    skillFilter === "Barchasi"
      ? technicians
      : technicians.filter((t) => t.skill === skillFilter)

  const unassignedDeals = deals.filter((d) => d.status === "Works")
  const allColumns = ["Works", ...technicians.map((t) => t.full_name)]

  const blockIfSick = (tech: Technician) => {
    const reason = sickTechnicianIds.get(tech.id)
    if (!reason) return false
    toast.error(`${tech.full_name} bugun kasal: ${reason}`)
    return true
  }

  const handleTimeChange = (id: string, start: string, end: string) =>
    updateJob({ id, scheduled_start: start, scheduled_end: end })

  const handleRowChange = (id: string, newRowId: string) => {
    const tech = technicians.find((t) => t.full_name === newRowId)
    if (!tech || blockIfSick(tech)) return // ← YANGI tekshiruv
    updateJob({ id, technician_id: tech.id })
  }

  const handleRemoveFromTimeline = (id: string) =>
    updateJob({
      id,
      technician_id: null,
      scheduled_start: null,
      scheduled_end: null,
    })

  const findColumn = (id: string) =>
    allColumns.includes(id)
      ? id
      : (deals.find((d) => d.id === id)?.status ?? null)

  const handleDragStart = ({ active }: DragStartEvent) => {
    const deal = deals.find((d) => d.id === active.id)
    if (deal) setActiveDeal(deal)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveDeal(null)
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    // Timeline ustiga tashlanganda
    if (overId.startsWith("timeline-")) {
      const techName = overId.replace("timeline-", "")
      const tech = technicians.find((t) => t.full_name === techName)
      if (!tech || blockIfSick(tech)) return
      const deal = deals.find((d) => d.id === activeId)
      updateJob({
        id: activeId,
        technician_id: tech.id,
        scheduled_start: deal?.startTime ?? "09:00",
        scheduled_end: deal?.endTime ?? "10:00",
      })
      return
    }

    const overContainer = findColumn(overId)
    if (!overContainer || overContainer === "Works") return

    const tech = technicians.find((t) => t.full_name === overContainer)
    if (!tech || blockIfSick(tech)) return

    const deal = deals.find((d) => d.id === activeId)
    setPendingStart(deal?.startTime ?? "")
    setPendingEnd(deal?.endTime ?? "")
    setPendingError("")
    setPendingAssign({
      dealId: activeId,
      technicianId: tech.id,
      technicianName: tech.full_name,
    })
  }

  const confirmPendingAssign = () => {
    if (!pendingAssign) return
    if (!pendingStart || !pendingEnd) {
      setPendingError("Boshlanish va tugash vaqtini kiriting")
      return
    }
    if (pendingStart >= pendingEnd) {
      setPendingError("Tugash vaqti boshlanishidan keyin bo'lishi kerak")
      return
    }
    updateJob({
      id: pendingAssign.dealId,
      technician_id: pendingAssign.technicianId,
      scheduled_start: pendingStart,
      scheduled_end: pendingEnd,
    })
    setPendingAssign(null)
  }

  const cancelPendingAssign = () => {
    setPendingAssign(null)
  }

  return (
    <KanbanContext.Provider
      value={{
        activeDeal,
        setActiveDeal,
        skillFilter,
        setSkillFilter,
        viewMode,
        setViewMode,
        pendingAssign,
        setPendingAssign,
        pendingStart,
        setPendingStart,
        pendingEnd,
        setPendingEnd,
        pendingError,
        setPendingError,
        technicians,
        visibleTechnicians,
        deals,
        unassignedDeals,
        techLoading,
        jobsLoading,
        sickTechnicianIds,
        createTechnician,
        deleteTechnician,
        updateTechnician,
        handleTimeChange,
        handleRowChange,
        handleRemoveFromTimeline,
        handleDragStart,
        handleDragEnd,
        confirmPendingAssign,
        cancelPendingAssign,
      }}
    >
      {children}
    </KanbanContext.Provider>
  )
}

export function useKanban() {
  const context = useContext(KanbanContext)
  if (context === undefined) {
    throw new Error("useKanban must be used within a KanbanProvider")
  }
  return context
}
