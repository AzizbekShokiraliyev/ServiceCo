import { useState, useMemo } from "react"
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  pointerWithin,
} from "@dnd-kit/core"
import { LayoutGrid, CalendarDays } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KanbanColumn } from "./KanbanColumn"
import { KanbanCard } from "./KanbanCard"
import AddWorkerModal from "./actionWorker/AddWorkerModal"
import DeleteWorker from "./actionWorker/DeleteWorker"
import type { KanbanDeal, Skill, Technician } from "@/interface/Interface"
import { TimelineView } from "./timleLine/TimelineView"
import { TimelineCard } from "./timleLine/TimelineCard"
import {
  useTechnicians,
  useTechnicianCreate,
  useTechnicianDelete,
} from "@/hooks/useTechnicians"
import { useJobs, useJobUpdate } from "@/hooks/useJobs"

const SKILL_LABELS: Record<Skill, string> = {
  Electrical: "Elektrik",
  Plumbing: "Santexnik",
  HVAC: "Konditsioner",
}

const SKILL_FILTERS = ["Barchasi", "Electrical", "Plumbing", "HVAC"] as const

type ViewMode = "kanban" | "timeline"

const Kanban = () => {
  const [activeDeal, setActiveDeal] = useState<KanbanDeal | null>(null)
  const [skillFilter, setSkillFilter] =
    useState<(typeof SKILL_FILTERS)[number]>("Barchasi")
  const [viewMode, setViewMode] = useState<ViewMode>("kanban")

  // ✅ Supabase hooks
  const { data: techniciansData = [], isLoading: techLoading } =
    useTechnicians()
  const { data: jobsData = [], isLoading: jobsLoading } = useJobs()
  const { mutate: createTechnician } = useTechnicianCreate()
  const { mutate: deleteTechnician } = useTechnicianDelete()
  const { mutate: updateJob } = useJobUpdate()

  // ✅ Supabase Technician → lokal Technician formatiga o'tkazish
  const technicians: Technician[] = useMemo(
    () =>
      techniciansData.map((t) => ({
        id: t.id,
        full_name: t.full_name,
        skill: t.skill,
        profile_id: t.profile_id,
        phone: t.phone,
        created_at: t.created_at,
      })),
    [techniciansData]
  )

  // ✅ Supabase Job → KanbanDeal formatiga o'tkazish
  const deals: KanbanDeal[] = useMemo(
    () =>
      jobsData.map((job) => ({
        id: job.id,
        client: job.client_name ?? "Noma'lum",
        title: job.title,
        status: job.technician?.full_name ?? "Works",
        startTime: job.scheduled_start ?? undefined,
        endTime: job.scheduled_end ?? undefined,
      })),
    [jobsData]
  )

  const visibleTechnicians =
    skillFilter === "Barchasi"
      ? technicians
      : technicians.filter((t) => t.skill === skillFilter)

  // ✅ Texnik qo'shish
  const addWorker = (name: string, skill: Skill) => {
    createTechnician({ full_name: name, skill })
  }

  // ✅ Texnik o'chirish
  const deleteWorker = (id: string) => {
    deleteTechnician(id)
  }

  // ✅ Vaqt o'zgartirish
  const handleTimeChange = (id: string, startTime: string, endTime: string) => {
    updateJob({
      id,
      scheduled_start: startTime,
      scheduled_end: endTime,
    })
  }

  // ✅ Qator o'zgartirish (timeline da)
  const handleRowChange = (id: string, newRowId: string) => {
    const tech = technicians.find((t) => t.full_name === newRowId)
    updateJob({
      id,
      technician_id: tech?.id ?? null,
    })
  }

  // ✅ Timelinedan olib tashlash
  const handleRemoveFromTimeline = (id: string) => {
    updateJob({
      id,
      technician_id: null,
      scheduled_start: null,
      scheduled_end: null,
    })
  }

  const allColumns = ["Works", ...technicians.map((t) => t.full_name)]

  const findColumn = (id: string): string | null => {
    if (allColumns.includes(id)) return id
    return deals.find((d) => d.id === id)?.status ?? null
  }

  const handleDragStart = (event: DragStartEvent) => {
    const deal = deals.find((d) => d.id === event.active.id)
    if (deal) setActiveDeal(deal)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDeal(null)
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string
    if (activeId === overId) return

    // Timeline'ga drag
    if (overId.startsWith("timeline-")) {
      const techName = overId.replace("timeline-", "")
      const tech = technicians.find((t) => t.full_name === techName)
      if (!tech) return

      const deal = deals.find((d) => d.id === activeId)
      const startTime = deal?.startTime ?? "09:00"
      const endTime = deal?.endTime ?? "10:00"

      updateJob({
        id: activeId,
        technician_id: tech.id,
        scheduled_start: startTime,
        scheduled_end: endTime,
      })
      return
    }

    const activeContainer = findColumn(activeId)
    const overContainer = findColumn(overId)
    if (!activeContainer || !overContainer) return
    if (overContainer === "Works") return

    // Texnikka tayinlash
    const tech = technicians.find((t) => t.full_name === overContainer)
    updateJob({
      id: activeId,
      technician_id: tech?.id ?? null,
    })
  }

  const unassignedDeals = deals.filter((d) => d.status === "Works")

  if (techLoading || jobsLoading) {
    return (
      <div className="flex h-[calc(100vh-160px)] min-w-full gap-6 overflow-hidden px-4 py-2">
        {/* Unassigned column skeleton */}
        <div className="flex w-64 flex-col rounded-xl border border-border/40 bg-muted/20 p-4 animate-pulse">
          <div className="mb-4 h-5 w-1/2 rounded bg-muted/40" />
          <div className="space-y-3">
            <div className="h-20 rounded-xl bg-muted/40" />
            <div className="h-20 rounded-xl bg-muted/40" />
          </div>
        </div>
        {/* Column skeletons */}
        <div className="flex flex-1 gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex w-52 flex-col rounded-xl border border-border/40 bg-muted/20 p-4 animate-pulse">
              <div className="mb-4 h-5 w-3/4 rounded bg-muted/40" />
              <div className="h-20 rounded-xl bg-muted/40" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-x-auto overflow-y-hidden px-4 py-2">
      <div className="mb-4 flex items-center justify-between">
        <Tabs
          value={skillFilter}
          onValueChange={(v) => setSkillFilter(v as typeof skillFilter)}
        >
          <TabsList>
            {SKILL_FILTERS.map((skill) => (
              <TabsTrigger key={skill} value={skill}>
                {skill}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <DeleteWorker workers={technicians} onDelete={deleteWorker} />
          <AddWorkerModal onAdd={addWorker} />

          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
          >
            <TabsList>
              <TabsTrigger value="kanban" className="gap-1.5">
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-1.5">
                <CalendarDays className="h-4 w-4" />
                Timeline
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {viewMode === "kanban" ? (
          <div className="flex min-w-max items-start gap-6 pb-4">
            <KanbanColumn
              status="Works"
              deals={unassignedDeals}
              heightClass="h-[580px]"
              widthClass="w-64"
              emptyText="Tayinlanmagan ish yo'q"
              emptyVariant="info"
              isDropDisabled={true}
              onTimeChange={handleTimeChange}
            />

            <div className="grid grid-cols-5 grid-rows-2 gap-4">
              {visibleTechnicians.map((tech) => (
                <KanbanColumn
                  key={tech.id}
                  status={tech.full_name}
                  deals={deals.filter((d) => d.status === tech.full_name)}
                  heightClass="h-[280px]"
                  widthClass="w-52"
                  subtitle={SKILL_LABELS[tech.skill]}
                  isDropDisabled={false}
                  onTimeChange={handleTimeChange}
                  onDelete={() => deleteWorker(tech.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <TimelineView
            technicians={visibleTechnicians}
            deals={deals}
            unassigned={unassignedDeals}
            onRemoveFromTimeline={handleRemoveFromTimeline}
            onTimeMove={handleTimeChange}
            onRowChange={handleRowChange}
          />
        )}

        <DragOverlay>
          {activeDeal ? (
            <div className="scale-105 rotate-1 opacity-90 shadow-lg">
              {viewMode === "timeline" ? (
                <TimelineCard deal={activeDeal} isOverlay />
              ) : (
                <KanbanCard deal={activeDeal} />
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default Kanban
