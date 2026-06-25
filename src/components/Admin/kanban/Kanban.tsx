import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  pointerWithin,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { LayoutGrid, CalendarDays } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KanbanColumn } from "./KanbanColumn"
import { KanbanCard } from "./KanbanCard"
import AddWorkerModal from "./actionWorker/AddWorkerModal"
import DeleteWorker from "./actionWorker/DeleteWorker"
import type { KanbanDeal, Skill, Technician } from "@/interface/Interface"
import { TimelineView } from "./timleLine/TimelineView"
import { TimelineCard } from "./timleLine/TimelineCard"

const SKILL_LABELS: Record<Skill, string> = {
  Electrical: "Elektrik",
  Plumbing: "Santexnik",
  HVAC: "Konditsioner",
}

const SKILL_FILTERS = ["Barchasi", "Electrical", "Plumbing", "HVAC"] as const

const INITIAL_TECHNICIANS: Technician[] = [
  { id: "t1", name: "Alisher", skill: "Electrical" },
  { id: "t2", name: "Bobur", skill: "Plumbing" },
  { id: "t3", name: "Davron", skill: "HVAC" },
  { id: "t4", name: "Eldor", skill: "Electrical" },
  { id: "t5", name: "Farrux", skill: "Plumbing" },
  { id: "t6", name: "Giyos", skill: "HVAC" },
  { id: "t7", name: "Hasan", skill: "Electrical" },
  { id: "t8", name: "Ilhom", skill: "Plumbing" },
  { id: "t9", name: "Jasur", skill: "HVAC" },
  { id: "t10", name: "Kamol", skill: "Electrical" },
]

const MOCK_DEALS: KanbanDeal[] = [
  {
    id: "d1",
    client: "Aziz Karimov",
    title: "Veb-sayt yaratish",
    status: "Works",
  },
  {
    id: "d2",
    client: "Dilshod Tursunov",
    title: "CRM integratsiyasi",
    status: "Works",
  },
  {
    id: "d3",
    client: "Nodira Yusupova",
    title: "Mobil ilova",
    status: "Alisher",
    startTime: "09:00",
    endTime: "13:00",
  },
  {
    id: "d4",
    client: "Sherzod Aliyev",
    title: "Logistika tizimi",
    status: "Bobur",
    startTime: "10:00",
    endTime: "12:00",
  },
  {
    id: "d5",
    client: "Gulnora Rashidova",
    title: "Onlayn do'kon",
    status: "Davron",
    startTime: "14:00",
    endTime: "17:00",
  },
  {
    id: "d6",
    client: "Botir Nazarov",
    title: "ERP tizimi",
    status: "Eldor",
    startTime: "08:00",
    endTime: "10:00",
  },
]

type ViewMode = "kanban" | "timeline"

const Kanban = () => {
  const [technicians, setTechnicians] =
    useState<Technician[]>(INITIAL_TECHNICIANS)
  const [deals, setDeals] = useState<KanbanDeal[]>(MOCK_DEALS)
  const [activeDeal, setActiveDeal] = useState<KanbanDeal | null>(null)
  const [skillFilter, setSkillFilter] =
    useState<(typeof SKILL_FILTERS)[number]>("Barchasi")
  const [viewMode, setViewMode] = useState<ViewMode>("kanban")

  const visibleTechnicians =
    skillFilter === "Barchasi"
      ? technicians
      : technicians.filter((t) => t.skill === skillFilter)

  const addWorker = (name: string, skill: Skill) => {
    setTechnicians((prev) => [...prev, { id: `t${Date.now()}`, name, skill }])
  }

  const deleteWorker = (id: string) => {
    const tech = technicians.find((t) => t.id === id)
    setTechnicians((prev) => prev.filter((t) => t.id !== id))
    if (tech) {
      setDeals((prev) =>
        prev.map((d) =>
          d.status === tech.name ? { ...d, status: "Works" } : d
        )
      )
    }
  }

  const handleTimeChange = (id: string, startTime: string, endTime: string) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, startTime, endTime } : d))
    )
  }

  const handleRowChange = (id: string, newRowId: string) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newRowId } : d))
    )
  }

  const handleRemoveFromTimeline = (id: string) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: "Works", startTime: undefined, endTime: undefined }
          : d
      )
    )
  }


  const allColumns = ["Works", ...technicians.map((t) => t.name)]

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

    if (overId.startsWith("timeline-")) {
      const techName = overId.replace("timeline-", "")
      const tech = technicians.find((t) => t.name === techName)
      if (!tech) return

      const deal = deals.find((d) => d.id === activeId)
      const startTime = deal?.startTime ?? "09:00"
      const endTime = deal?.endTime ?? "10:00"

      setDeals((prev) =>
        prev.map((d) =>
          d.id === activeId ? { ...d, status: techName, startTime, endTime } : d
        )
      )
      return
    }

    const activeContainer = findColumn(activeId)
    const overContainer = findColumn(overId)
    if (!activeContainer || !overContainer) return
    if (overContainer === "Works") return

    const activeIndex = deals.findIndex((d) => d.id === activeId)
    const overIndex = deals.findIndex((d) => d.id === overId)
    if (activeIndex === -1) return

    const reordered =
      overIndex !== -1 ? arrayMove(deals, activeIndex, overIndex) : [...deals]
    setDeals(
      reordered.map((d) =>
        d.id === activeId ? { ...d, status: overContainer } : d
      )
    )
  }

  const unassignedDeals = deals.filter((d) => d.status === "Works")

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
                  status={tech.name}
                  deals={deals.filter((d) => d.status === tech.name)}
                  heightClass="h-[280px]"
                  widthClass="w-53"
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
