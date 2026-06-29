import { Timeline, type TimelineRow, type TimelineEvent } from "./Timeline"
import type { KanbanDeal, Technician } from "@/interface/Interface"
import { LAYOUT } from "../constants/kanbanConstants"
import { KanbanCard } from "../KanbanCard"
import { hasTimeConflict } from "./utils/timelineUtils"
import { toast } from "sonner"
import { useKanban } from "../context/KanbanContext"

const toRows = (technicians: Technician[]): TimelineRow[] =>
  technicians.map((t) => ({
    id: t.full_name,
    label: t.full_name,
    sublabel: t.skill,
    avatarChar: t.full_name[0],
  }))

const toEvents = (deals: KanbanDeal[]): TimelineEvent[] =>
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

const CONFLICT_MESSAGES = {
  time: "Bu ustaning tanlangan vaqtda boshqa ishi bor. Boshqa vaqt tanlang.",
  row: "Bu usta tanlangan vaqtda band. Boshqa ustani tanlang.",
}

export const TimelineView = () => {
  const {
    visibleTechnicians,
    deals,
    unassignedDeals,
    handleRemoveFromTimeline,
    handleTimeChange,
    handleRowChange,
  } = useKanban()

  const events = toEvents(deals)
  const rows = toRows(visibleTechnicians)

  const handleTimeMove = (id: string, start: string, end: string) => {
    const event = events.find((e) => e.id === id)
    if (!event) return
    if (hasTimeConflict(events, event.rowId, start, end, id)) {
      toast.error(CONFLICT_MESSAGES.time)
      return
    }
    handleTimeChange(id, start, end)
  }

  const handleRowMove = (id: string, newRowId: string) => {
    const event = events.find((e) => e.id === id)
    if (!event) return
    if (hasTimeConflict(events, newRowId, event.startTime, event.endTime, id)) {
      toast.error(CONFLICT_MESSAGES.row)
      return
    }
    handleRowChange(id, newRowId)
  }

  return (
    <div className={`flex ${LAYOUT.BOARD_HEIGHT} gap-4`}>
      <div
        className={`flex ${LAYOUT.UNASSIGNED_WIDTH} shrink-0 flex-col rounded-xl border border-border/40 bg-muted/30 p-4`}
      >
        <div className="mb-4 px-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold tracking-wider text-foreground/80 uppercase">
              Works
            </h3>
            <span className="rounded-md border border-border/20 bg-background px-2 py-0.5 text-xs font-medium text-foreground/70 shadow-sm">
              {unassignedDeals.length}
            </span>
          </div>
        </div>

        <div className="flex-1 scrollbar-thin space-y-3 overflow-y-auto p-0.5 select-none">
          {unassignedDeals.length === 0 ? (
            <div className="flex h-20 items-center justify-center text-xs text-muted-foreground/40 italic">
              Hammasi tayinlangan
            </div>
          ) : (
            unassignedDeals.map((deal) => (
              <KanbanCard key={deal.id} deal={deal} />
            ))
          )}
        </div>
      </div>

      <div className="relative min-w-0 flex-1">
        <Timeline
          rows={rows}
          events={events}
          height={LAYOUT.BOARD_HEIGHT}
          onEventMove={handleTimeMove}
          onEventRemove={handleRemoveFromTimeline}
          onEventRowChange={handleRowMove}
        />
      </div>
    </div>
  )
}
