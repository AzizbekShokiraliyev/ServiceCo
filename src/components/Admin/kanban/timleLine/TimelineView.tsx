import { User } from "lucide-react"
import { useDroppable } from "@dnd-kit/core"
import { Badge } from "@/components/ui/badge"
import type { KanbanDeal, Technician } from "@/interface/Interface"
import {
  Timeline,
  type TimelineEvent,
  type TimelineRow,
  ROW_HEIGHT,
  NAME_COL_WIDTH,
} from "@/components/shared/timeLine/Timeline"
import { TimelineCard } from "./TimelineCard"

const DroppableGridRow = ({ tech }: { tech: Technician }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `timeline-${tech.full_name}`,
  })
  return (
    <div
      ref={setNodeRef}
      className={`absolute inset-0 ${isOver ? "bg-primary/5" : ""}`}
    />
  )
}

const toTimelineRows = (technicians: Technician[]): TimelineRow[] =>
  technicians.map((t) => ({
    id: t.full_name,
    label: t.full_name,
    sublabel: t.skill,
    avatarChar: t.full_name[0],
  }))

const toTimelineEvents = (deals: KanbanDeal[]): TimelineEvent[] =>
  deals
    .filter((d) => d.startTime && d.endTime && d.status !== "Works")
    .map((d) => ({
      id: d.id,
      rowId: d.status,
      title: d.title,
      subtitle: d.client,
      startTime: d.startTime!,
      endTime: d.endTime!,
    }))

interface TimelineViewProps {
  technicians: Technician[]
  deals: KanbanDeal[]
  unassigned: KanbanDeal[]
  onRemoveFromTimeline: (id: string) => void
  onTimeMove: (id: string, startTime: string, endTime: string) => void
  onRowChange: (id: string, newRowId: string) => void
}

export const TimelineView = ({
  technicians,
  deals,
  unassigned,
  onRemoveFromTimeline,
  onTimeMove,
  onRowChange,
}: TimelineViewProps) => {
  const rows = toTimelineRows(technicians)
  const events = toTimelineEvents(deals)

  return (
    <div className="flex h-[640px] gap-4">
      <div className="flex w-64 shrink-0 flex-col rounded-xl border border-border/40 bg-muted/30 p-3">
        <div className="mb-3 flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-bold tracking-wider text-foreground/80 uppercase">
            Tayinlanmagan
          </span>
          <Badge
            variant="outline"
            className="ml-auto bg-background text-foreground/70"
          >
            {unassigned.length}
          </Badge>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {unassigned.length === 0 ? (
            <p className="mt-4 text-center text-xs text-muted-foreground/50 italic">
              Hammasi tayinlangan
            </p>
          ) : (
            unassigned.map((deal) => <TimelineCard key={deal.id} deal={deal} />)
          )}
        </div>
      </div>

      <div className="relative min-w-0 flex-1">
        <Timeline
          rows={rows}
          events={events}
          height="h-[640px]"
          onEventMove={onTimeMove}
          onEventRemove={onRemoveFromTimeline}
          onEventRowChange={onRowChange}
        />

        {technicians.map((tech, rowIndex) => {
          const HEADER_HEIGHT = 33
          return (
            <div
              key={tech.id}
              style={{
                position: "absolute",
                top: HEADER_HEIGHT + rowIndex * ROW_HEIGHT,
                left: NAME_COL_WIDTH,
                right: 0,
                height: ROW_HEIGHT,
                pointerEvents: "none",
              }}
            >
              <DroppableGridRow tech={tech} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
