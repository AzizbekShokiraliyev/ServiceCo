import { createContext, useContext, useMemo, useCallback } from "react"
import type { ReactNode } from "react"
import { useJobs, useJobUpdate } from "@/hooks/useJobs"
import type { JobsContextType, KanbanDeal } from "@/interface/Interface"
import { toast } from "sonner"
import {
  hasTimeConflict,
  dealsToEvents,
} from "../kanban/timeline/utils/timelineUtils"
import { useTechnicianContext } from "./TechnicianContext"

const CONFLICT_MESSAGE =
  "Bu usta tanlangan vaqtda band. Boshqa vaqt yoki ustani tanlang."

const JobsContext = createContext<JobsContextType | undefined>(undefined)

export function JobsProvider({ children }: { children: ReactNode }) {
  const { technicians, blockIfSick } = useTechnicianContext()

  const { data: jobsData = [], isLoading: jobsLoading } = useJobs()
  const { mutate: updateJob } = useJobUpdate()

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

  // Vaqt to'qnashuvini tekshirish uchun umumiy event ro'yxati
  const events = useMemo(() => dealsToEvents(deals), [deals])

  const unassignedDeals = useMemo(
    () => deals.filter((d) => d.status === "Works"),
    [deals]
  )

  const handleTimeChange = useCallback(
    (id: string, start: string, end: string) => {
      const deal = deals.find((d) => d.id === id)
      if (
        deal &&
        deal.status !== "Works" &&
        hasTimeConflict(events, deal.status, start, end, id)
      ) {
        toast.error(CONFLICT_MESSAGE, { position: "top-center" })
        return
      }
      updateJob({ id, scheduled_start: start, scheduled_end: end })
    },
    [deals, events, updateJob]
  )

  const handleRowChange = useCallback(
    (id: string, newRowId: string) => {
      const tech = technicians.find((t) => t.id === newRowId)
      if (!tech || blockIfSick(tech)) return

      const deal = deals.find((d) => d.id === id)
      if (
        deal?.startTime &&
        deal?.endTime &&
        hasTimeConflict(events, newRowId, deal.startTime, deal.endTime, id)
      ) {
        toast.error(CONFLICT_MESSAGE, { position: "top-center" })
        return
      }

      updateJob({ id, technician_id: tech.id })
    },
    [technicians, deals, events, blockIfSick, updateJob]
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

  const value = useMemo<JobsContextType>(
    () => ({
      deals,
      unassignedDeals,
      jobsLoading,
      handleTimeChange,
      handleRowChange,
      handleRemoveFromTimeline,
    }),
    [
      deals,
      unassignedDeals,
      jobsLoading,
      handleTimeChange,
      handleRowChange,
      handleRemoveFromTimeline,
    ]
  )

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>
}

export function useJobsContext() {
  const context = useContext(JobsContext)
  if (context === undefined) {
    throw new Error("useJobsContext must be used within a JobsProvider")
  }
  return context
}
