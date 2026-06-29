import { useState, useMemo } from "react"
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { LayoutGrid, CalendarDays } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { KanbanColumn } from "./KanbanColumn"
import { KanbanCard } from "./KanbanCard"
import AddWorkerModal from "./actionWorker/AddWorkerModal"
import DeleteWorker from "./actionWorker/DeleteWorker"
import type { KanbanDeal, Skill, Technician } from "@/interface/Interface"
import {
  useTechnicians,
  useTechnicianCreate,
  useTechnicianDelete,
} from "@/hooks/useTechnicians"
import { useJobs, useJobUpdate } from "@/hooks/useJobs"
import { LAYOUT } from "./constants/kanbanConstants"
import { TimelineView } from "./timeline/TimelineView"

const SKILL_LABELS: Record<Skill, string> = {
  Electrical: "Elektrik",
  Plumbing: "Santexnik",
  HVAC: "Konditsioner",
}

const SKILL_FILTERS = ["Barchasi", "Electrical", "Plumbing", "HVAC"] as const

type ViewMode = "kanban" | "timeline"

// ✅ Worker ustuniga tashlangan, lekin hali tasdiqlanmagan ish
interface PendingAssign {
  dealId: string
  technicianId: string
  technicianName: string
}

const Kanban = () => {
  const [activeDeal, setActiveDeal] = useState<KanbanDeal | null>(null)
  const [skillFilter, setSkillFilter] =
    useState<(typeof SKILL_FILTERS)[number]>("Barchasi")
  const [viewMode, setViewMode] = useState<ViewMode>("kanban")

  // ✅ Vaqt so'rovchi alert-dialog uchun state
  const [pendingAssign, setPendingAssign] = useState<PendingAssign | null>(null)
  const [pendingStart, setPendingStart] = useState("")
  const [pendingEnd, setPendingEnd] = useState("")
  const [pendingError, setPendingError] = useState("")

  const { data: techniciansData = [], isLoading: techLoading } =
    useTechnicians()
  const { data: jobsData = [], isLoading: jobsLoading } = useJobs()
  const { mutate: createTechnician } = useTechnicianCreate()
  const { mutate: deleteTechnician } = useTechnicianDelete()
  const { mutate: updateJob } = useJobUpdate()

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

  const deals: KanbanDeal[] = useMemo(
    () =>
      jobsData
        .filter((job) => job.status !== "completed") // ✅ Tugatilgan ishlarni kanbandan yashiramiz
        .map((job) => ({
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

  const unassignedDeals = deals.filter((d) => d.status === "Works")

  const addWorker = (name: string, skill: Skill) =>
    createTechnician({ full_name: name, skill })
  const deleteWorker = (id: string) => deleteTechnician(id)

  const handleTimeChange = (id: string, start: string, end: string) =>
    updateJob({ id, scheduled_start: start, scheduled_end: end })

  const handleRowChange = (id: string, newRowId: string) => {
    const tech = technicians.find((t) => t.full_name === newRowId)
    updateJob({ id, technician_id: tech?.id ?? null })
  }

  const handleRemoveFromTimeline = (id: string) =>
    updateJob({
      id,
      technician_id: null,
      scheduled_start: null,
      scheduled_end: null,
    })

  const allColumns = ["Works", ...technicians.map((t) => t.full_name)]

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

    // Timeline ustiga tashlash — o'zgarishsiz, u allaqachon vaqtni biladi
    if (overId.startsWith("timeline-")) {
      const techName = overId.replace("timeline-", "")
      const tech = technicians.find((t) => t.full_name === techName)
      if (!tech) return
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
    if (!tech) return

    // ✅ Darrov tayinlamaymiz — `deals` o'zgarmagani uchun karta avtomatik
    // o'z joyiga animatsiya bilan qaytadi, va shu payt vaqt so'rovchi dialog ochiladi.
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

  const cancelPendingAssign = () => setPendingAssign(null)

  if (techLoading || jobsLoading) {
    return (
      <div className="flex h-[calc(100vh-160px)] min-w-full gap-6 overflow-hidden px-4 py-2">
        <div className="flex w-64 animate-pulse flex-col rounded-xl border border-border/40 bg-muted/20 p-4">
          <div className="mb-4 h-5 w-1/2 rounded bg-muted/40" />
          <div className="space-y-3">
            <div className="h-20 rounded-xl bg-muted/40" />
            <div className="h-20 rounded-xl bg-muted/40" />
          </div>
        </div>
        <div className="flex flex-1 gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex w-52 animate-pulse flex-col rounded-xl border border-border/40 bg-muted/20 p-4"
            >
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
                <LayoutGrid className="h-4 w-4" /> Kanban
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-1.5">
                <CalendarDays className="h-4 w-4" /> Timeline
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
              heightClass={LAYOUT.UNASSIGNED_HEIGHT}
              widthClass={LAYOUT.UNASSIGNED_WIDTH}
              emptyText="Tayinlanmagan ish yo'q"
              emptyVariant="info"
              isDropDisabled
              onTimeChange={handleTimeChange}
            />

            <div className="grid grid-cols-5 grid-rows-2 gap-4">
              {visibleTechnicians.map((tech) => (
                <KanbanColumn
                  key={tech.id}
                  status={tech.full_name}
                  deals={deals.filter((d) => d.status === tech.full_name)}
                  heightClass={LAYOUT.COLUMN_HEIGHT}
                  widthClass={LAYOUT.COLUMN_WIDTH}
                  subtitle={SKILL_LABELS[tech.skill]}
                  onTimeChange={handleTimeChange}
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
          {activeDeal && (
            <div className="scale-105 rotate-1 opacity-90 shadow-lg">
              <KanbanCard deal={activeDeal} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* ✅ Workerga tashlanganda vaqt so'rovchi alert-dialog */}
      <AlertDialog
        open={!!pendingAssign}
        onOpenChange={(open) => !open && cancelPendingAssign()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAssign?.technicianName}ga tayinlash
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ishni tayinlashdan oldin ish vaqtini belgilang.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="pending-start">Boshlanish vaqti</Label>
              <Input
                id="pending-start"
                type="time"
                value={pendingStart}
                onChange={(e) => setPendingStart(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pending-end">Tugash vaqti</Label>
              <Input
                id="pending-end"
                type="time"
                value={pendingEnd}
                onChange={(e) => setPendingEnd(e.target.value)}
              />
            </div>
            {pendingError && (
              <p className="text-xs text-destructive">{pendingError}</p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelPendingAssign}>
              Bekor qilish
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmPendingAssign}>
              Tayinlash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Kanban
