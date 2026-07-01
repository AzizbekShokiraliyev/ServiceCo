import { X, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  HOUR_WIDTH,
  ROW_HEIGHT,
} from "@/components/Admin/kanban/constants/timeLineConstants"
import type { PositionedEvent, TimelineRow } from "@/interface/Interface"
import { useTimelineInteraction } from "@/hooks/useTimelineInteraction"
import { Button } from "@/components/ui/button"
import { TimelineTimeEditDialog } from "./Timelinetimeeditdialog"

interface TimelineBlockProps {
  event: PositionedEvent
  rows?: TimelineRow[]
  readOnly?: boolean
  onMove?: (id: string, start: string, end: string) => void
  onRemove?: (id: string) => void
  onRowChange?: (id: string, newRowId: string) => void
}

export const TimelineBlock = ({
  event,
  rows = [],
  readOnly,
  onMove,
  onRemove,
  onRowChange,
}: TimelineBlockProps) => {
  const { startMins, endMins, isInteracting, onPointerDown } =
    useTimelineInteraction({
      initialStart: event.startTime,
      initialEnd: event.endTime,
      hourWidth: HOUR_WIDTH,
      readOnly,
      onSave: (start, end) => onMove?.(event.id, start, end),
    })

  const durationMins = Math.max(30, endMins - startMins)
  const left = (startMins / 60) * HOUR_WIDTH
  const width = (durationMins / 60) * HOUR_WIDTH

  const PADDING = 4
  const laneHeight = (ROW_HEIGHT - PADDING * 2) / event.laneCount
  const top = PADDING + event.laneIndex * laneHeight
  const height = laneHeight - 2

  return (
    <div
      style={{ left, width, top, height }}
      onPointerDown={(e) => onPointerDown(e, "move")}
      className={cn(
        "group absolute flex flex-col justify-between",
        "rounded-[10px] border bg-card px-2.5 py-2 select-none",
        "transition-[border-color,box-shadow]",
        readOnly ? "cursor-default" : "cursor-grab active:cursor-grabbing",
        isInteracting
          ? "border-border-accent z-50 shadow-md ring-2 ring-accent/20 transition-none"
          : "hover:border-border-strong z-10 border-border hover:shadow-sm"
      )}
    >
      <div className="pointer-events-none min-w-0">
        <p className="truncate text-xs font-medium text-foreground">
          {event.title}
        </p>
        {event.subtitle && (
          <p className="truncate text-[11px] text-muted-foreground">
            {event.subtitle}
          </p>
        )}
      </div>

      {!readOnly && onMove ? (
        <TimelineTimeEditDialog
          event={event}
          rows={rows}
          onSave={(start, end) => onMove(event.id, start, end)}
          onRowChange={
            onRowChange ? (rowId) => onRowChange(event.id, rowId) : undefined
          }
        />
      ) : (
        <span className="pointer-events-none flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="h-2.5 w-2.5" />
          {event.startTime} – {event.endTime}
        </span>
      )}

      {!readOnly && onRemove && (
        <Button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onRemove(event.id)}
          className="pointer-events-auto absolute top-1.5 right-1.5 hidden h-5 w-4 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-colors group-hover:flex hover:bg-destructive/20"
          aria-label="O'chirish"
        >
          <X className="h-2.5 w-2.5" />
        </Button>
      )}

      {!readOnly && onMove && (
        <div
          onPointerDown={(e) => onPointerDown(e, "resize")}
          className="absolute top-0 right-0 h-full w-2 cursor-ew-resize rounded-r-[10px] opacity-0 transition-opacity hover:bg-green-500/30 hover:opacity-100 active:bg-green-500/40 active:opacity-100"
        />
      )}
    </div>
  )
}
