/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react"
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
import {
  validateTimeRange,
  hasTimeConflict,
  dealsToEvents,
} from "../timeline/utils/timelineUtils"

export type ViewMode = "kanban" | "timeline"

const CONFLICT_MESSAGE =
  "Bu usta tanlangan vaqtda band. Boshqa vaqt yoki ustani tanlang."

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
  }) => void
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

  // MUHIM: status maydoni technician.id (yoki "Works") ni saqlaydi, full_name emas.
  // "completed" va "rejected" ishlar boardda ko'rsatilmaydi — rad etilgan ish
  // shu yerda chiqarib tashlanadi, shuning uchun foydalanuvchi uni darhol
  // ustundan yo'qolganini ko'radi (avval bu filtr yo'q edi va rad etilgan
  // ish ustunda o'zgarishsiz qolib, "hech narsa bo'lmagandek" ko'rinar edi).
  const deals: KanbanDeal[] = useMemo(
    () =>
      jobsData
        .filter(
          (job) => job.status !== "completed" && job.status !== "rejected"
        )
        .map((job) => ({
          id: job.id,
          client: job.client_name ?? "Noma'lum",
          title: job.title,
          status: job.technician_id ?? "Works",
          startTime: job.scheduled_start ?? undefined,
          endTime: job.scheduled_end ?? undefined,
        })),
    [jobsData]
  )

  // Vaqt to'qnashuvini tekshirish uchun umumiy event ro'yxati (reusable,
  // TimelineView'dagi mantiq bilan bir xil — dealsToEvents orqali).
  const events = useMemo(() => dealsToEvents(deals), [deals])

  const visibleTechnicians = useMemo(
    () =>
      skillFilter === "Barchasi"
        ? technicians
        : technicians.filter((t) => t.skill === skillFilter),
    [technicians, skillFilter]
  )

  const unassignedDeals = useMemo(
    () => deals.filter((d) => d.status === "Works"),
    [deals]
  )

  const allColumns = useMemo(
    () => ["Works", ...technicians.map((t) => t.id)],
    [technicians]
  )

  const blockIfSick = useCallback(
    (tech: Technician) => {
      const reason = sickTechnicianIds.get(tech.id)
      if (!reason) return false
      toast.error(`${tech.full_name} bugun kasal: ${reason}`)
      return true
    },
    [sickTechnicianIds]
  )

  const handleTimeChange = useCallback(
    (id: string, start: string, end: string) =>
      updateJob({ id, scheduled_start: start, scheduled_end: end }),
    [updateJob]
  )

  const handleRowChange = useCallback(
    (id: string, newRowId: string) => {
      const tech = technicians.find((t) => t.id === newRowId)
      if (!tech || blockIfSick(tech)) return
      updateJob({ id, technician_id: tech.id })
    },
    [technicians, blockIfSick, updateJob]
  )

  const handleRemoveFromTimeline = useCallback(
    (id: string) =>
      updateJob({
        id,
        technician_id: null,
        scheduled_start: null,
        scheduled_end: null,
      }),
    [updateJob]
  )

  const findColumn = useCallback(
    (id: string) =>
      allColumns.includes(id)
        ? id
        : (deals.find((d) => d.id === id)?.status ?? null),
    [allColumns, deals]
  )

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const deal = deals.find((d) => d.id === active.id)
      if (deal) setActiveDeal(deal)
    },
    [deals]
  )

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveDeal(null)
      if (!over || active.id === over.id) return

      const activeId = active.id as string
      const overId = over.id as string

      // Timeline ustiga tashlaganda (droppable id: Timeline.tsx'da `timeline-${row.id}`)
      if (overId.startsWith("timeline-")) {
        const techId = overId.replace("timeline-", "")
        const tech = technicians.find((t) => t.id === techId)
        if (!tech || blockIfSick(tech)) return

        const deal = deals.find((d) => d.id === activeId)
        const start = deal?.startTime ?? "09:00"
        const end = deal?.endTime ?? "10:00"

        if (hasTimeConflict(events, techId, start, end, activeId)) {
          toast.error(CONFLICT_MESSAGE)
          return
        }

        updateJob({
          id: activeId,
          technician_id: tech.id,
          scheduled_start: start,
          scheduled_end: end,
        })
        return
      }

      const overContainer = findColumn(overId)
      if (!overContainer || overContainer === "Works") return

      const tech = technicians.find((t) => t.id === overContainer)
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
    },
    [technicians, deals, events, blockIfSick, updateJob, findColumn]
  )

  const confirmPendingAssign = useCallback(() => {
    if (!pendingAssign) return

    const err = validateTimeRange(pendingStart, pendingEnd)
    if (err) {
      setPendingError(err)
      return
    }

    if (
      hasTimeConflict(
        events,
        pendingAssign.technicianId,
        pendingStart,
        pendingEnd,
        pendingAssign.dealId
      )
    ) {
      setPendingError(CONFLICT_MESSAGE)
      return
    }

    updateJob({
      id: pendingAssign.dealId,
      technician_id: pendingAssign.technicianId,
      scheduled_start: pendingStart,
      scheduled_end: pendingEnd,
    })
    setPendingAssign(null)
  }, [pendingAssign, pendingStart, pendingEnd, events, updateJob])

  const cancelPendingAssign = useCallback(() => {
    setPendingAssign(null)
  }, [])

  const value = useMemo<KanbanContextType>(
    () => ({
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
    }),
    [
      activeDeal,
      skillFilter,
      viewMode,
      pendingAssign,
      pendingStart,
      pendingEnd,
      pendingError,
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
    ]
  )

  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  )
}

export function useKanban() {
  const context = useContext(KanbanContext)
  if (context === undefined) {
    throw new Error("useKanban must be used within a KanbanProvider")
  }
  return context
}
