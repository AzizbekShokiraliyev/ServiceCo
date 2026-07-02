import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react"
import type { ReactNode } from "react"
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core"
import { useJobUpdate } from "@/hooks/useJobs"
import type { KanbanDeal, PendingAssign } from "@/interface/Interface"

import {
  validateTimeRange,
  hasTimeConflict,
  dealsToEvents,
} from "../kanban/timeline/utils/timelineUtils"
import { useTechnicianContext } from "./TechnicianContext"
import { useJobsContext } from "./JobsContext"

const CONFLICT_MESSAGE =
  "Bu usta tanlangan vaqtda band. Boshqa vaqt yoki ustani tanlang."

interface DragAssignContextType {
  activeDeal: KanbanDeal | null
  setActiveDeal: React.Dispatch<React.SetStateAction<KanbanDeal | null>>

  pendingAssign: PendingAssign | null
  setPendingAssign: React.Dispatch<React.SetStateAction<PendingAssign | null>>
  pendingStart: string
  setPendingStart: (value: string) => void
  pendingEnd: string
  setPendingEnd: (value: string) => void
  pendingError: string
  setPendingError: (value: string) => void

  // Handlers
  handleDragStart: (event: DragStartEvent) => void
  handleDragEnd: (event: DragEndEvent) => void
  confirmPendingAssign: () => void
  cancelPendingAssign: () => void
}

const DragAssignContext = createContext<DragAssignContextType | undefined>(
  undefined
)

export function DragAssignProvider({ children }: { children: ReactNode }) {
  const { technicians, blockIfSick } = useTechnicianContext()
  const { deals } = useJobsContext()
  const { mutate: updateJob } = useJobUpdate()

  const [activeDeal, setActiveDeal] = useState<KanbanDeal | null>(null)
  const [pendingAssign, setPendingAssign] = useState<PendingAssign | null>(null)
  const [pendingStart, setPendingStart] = useState("")
  const [pendingEnd, setPendingEnd] = useState("")
  const [pendingError, setPendingError] = useState("")

  const events = useMemo(() => dealsToEvents(deals), [deals])

  const allColumns = useMemo(
    () => ["Works", ...technicians.map((t) => t.id)],
    [technicians]
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
      const techId = overId.startsWith("timeline-")
        ? overId.replace("timeline-", "")
        : findColumn(overId)

      if (!techId || techId === "Works") return

      const tech = technicians.find((t) => t.id === techId)
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
    [technicians, deals, blockIfSick, findColumn]
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

  const value = useMemo<DragAssignContextType>(
    () => ({
      activeDeal,
      setActiveDeal,
      pendingAssign,
      setPendingAssign,
      pendingStart,
      setPendingStart,
      pendingEnd,
      setPendingEnd,
      pendingError,
      setPendingError,
      handleDragStart,
      handleDragEnd,
      confirmPendingAssign,
      cancelPendingAssign,
    }),
    [
      activeDeal,
      pendingAssign,
      pendingStart,
      pendingEnd,
      pendingError,
      handleDragStart,
      handleDragEnd,
      confirmPendingAssign,
      cancelPendingAssign,
    ]
  )

  return (
    <DragAssignContext.Provider value={value}>
      {children}
    </DragAssignContext.Provider>
  )
}

export function useDragAssignContext() {
  const context = useContext(DragAssignContext)
  if (context === undefined) {
    throw new Error(
      "useDragAssignContext must be used within a DragAssignProvider"
    )
  }
  return context
}
