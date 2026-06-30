import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core"
import { LayoutGrid, CalendarDays } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { KanbanColumn } from "./KanbanColumn"
import { KanbanCard } from "./KanbanCard"
import { AssignTimeModal } from "./AssignTimeModal"
import { TimelineView } from "./timeline/TimelineView"

import { LAYOUT, SKILL_FILTERS } from "./constants/kanbanConstants"
import type { Skill } from "@/interface/Interface"
import {
  KanbanProvider,
  useKanban,
  type ViewMode,
} from "./context/KanbanContext"

const SKILL_LABELS: Record<Skill, string> = {
  Electrical: "Elektrik",
  Plumbing: "Santexnik",
  HVAC: "Konditsioner",
}

function KanbanContent() {
  const {
    activeDeal,
    skillFilter,
    setSkillFilter,
    viewMode,
    setViewMode,
    visibleTechnicians,
    techLoading,
    jobsLoading,
    handleDragStart,
    handleDragEnd,
  } = useKanban()

  if (techLoading || jobsLoading) {
    return (
      <div className="flex h-[calc(100vh-160px)] min-w-full animate-pulse gap-6 overflow-hidden px-4 py-2">
        <div className="flex w-64 flex-col rounded-xl border bg-muted/20 p-4" />
        <div className="flex flex-1 gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex w-52 flex-col rounded-xl border bg-muted/20 p-4"
            />
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
              heightClass={LAYOUT.UNASSIGNED_HEIGHT}
              widthClass={LAYOUT.UNASSIGNED_WIDTH}
              emptyText="Tayinlanmagan ish yo'q"
              emptyVariant="info"
              isDropDisabled
            />

            <div className="grid grid-cols-5 grid-rows-2 gap-4">
              {visibleTechnicians.map((tech) => (
                <KanbanColumn
                  key={tech.id}
                  status={tech.full_name}
                  heightClass={LAYOUT.COLUMN_HEIGHT}
                  widthClass={LAYOUT.COLUMN_WIDTH}
                  subtitle={SKILL_LABELS[tech.skill]}
                />
              ))}
            </div>
          </div>
        ) : (
          <TimelineView />
        )}

        <DragOverlay>
          {activeDeal && (
            <div className="scale-105 rotate-1 opacity-90 shadow-lg">
              <KanbanCard deal={activeDeal} editable={false} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <AssignTimeModal />
    </div>
  )
}

const Kanban = () => {
  return (
    <KanbanProvider>
      <KanbanContent />
    </KanbanProvider>
  )
}

export default Kanban
