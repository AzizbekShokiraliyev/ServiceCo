import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  pointerWithin,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { KanbanColumn } from "./KanbanColumn"
import { KanbanCard } from "./KanbanCard"
import AddWorkerModal from "./actionWorker/AddWorkerModal"
import DeleteWorker from "./actionWorker/DeleteWorker"
import type { KanbanDeal, Skill, Technician } from "@/interface/Interface"

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

const Kanban = () => {
  const [technicians, setTechnicians] =
    useState<Technician[]>(INITIAL_TECHNICIANS)
  const [deals, setDeals] = useState<KanbanDeal[]>(MOCK_DEALS)
  const [activeDeal, setActiveDeal] = useState<KanbanDeal | null>(null)
  const [skillFilter, setSkillFilter] =
    useState<(typeof SKILL_FILTERS)[number]>("Barchasi")

  const visibleTechnicians =
    skillFilter === "Barchasi"
      ? technicians
      : technicians.filter((t) => t.skill === skillFilter)

  const addWorker = (name: string, skill: Skill) => {
    const id = `t${Date.now()}`
    setTechnicians((prev) => [...prev, { id, name, skill }])
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

  const handleTimeChange = (id: string, startTime: string, endTime: string) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, startTime, endTime } : d))
    )
  }

  return (
    <div className="h-full overflow-x-auto overflow-y-hidden px-4 py-2">
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex min-w-max items-start gap-6 pb-4">
          <KanbanColumn
            status="Works"
            deals={deals.filter((d) => d.status === "Works")}
            heightClass="h-[640px]"
            widthClass="w-64"
            emptyText="Tayinlanmagan ish yo'q"
            emptyVariant="info"
            isDropDisabled={true}
            onTimeChange={handleTimeChange}
          />

          <div className="flex h-[640px] flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex gap-1">
                {SKILL_FILTERS.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setSkillFilter(skill)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      skillFilter === skill
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background text-foreground/70 hover:bg-accent"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <DeleteWorker workers={technicians} onDelete={deleteWorker} />
                <AddWorkerModal onAdd={addWorker} />
              </div>
            </div>

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
        </div>

        <DragOverlay>
          {activeDeal ? (
            <div className="scale-105 rotate-2 opacity-85 shadow-lg">
              <KanbanCard deal={activeDeal} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default Kanban
