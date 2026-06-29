// src/components/Admin/kanban/timeline/TimelineBlock.tsx
import { Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TimelineTimeEditDialog } from "./Timelinetimeeditdialog"
import {
  HOUR_WIDTH,
  ROW_HEIGHT,
} from "@/components/Admin/kanban/constants/timeLineConstants"
import type { PositionedEvent, TimelineRow } from "@/interface/Interface"
import { useTimelineInteraction } from "@/hooks/useTimelineInteraction"

// ✅ Barcha mantiqni o'ziga olgan Hook

interface TimelineBlockProps {
  event: PositionedEvent
  rows?: TimelineRow[]
  readOnly?: boolean
  onMove?: (id: string, startTime: string, endTime: string) => void
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
  // Custom hookni chaqiramiz
  const { startMins, endMins, isInteracting, onPointerDown } =
    useTimelineInteraction({
      initialStart: event.startTime,
      initialEnd: event.endTime,
      hourWidth: HOUR_WIDTH,
      readOnly,
      onSave: (newStart, newEnd) => onMove?.(event.id, newStart, newEnd),
    })

  // Vizual hisob-kitoblar (Hookdan kelayotgan Optimistic state orqali chiziladi)
  const durationMins = Math.max(30, endMins - startMins)
  const left = (startMins / 60) * HOUR_WIDTH
  const width = (durationMins / 60) * HOUR_WIDTH

  // Balandlik va Overlap mantig'i
  const PADDING = 4
  const laneHeight = (ROW_HEIGHT - PADDING * 2) / event.laneCount
  const top = PADDING + event.laneIndex * laneHeight
  const height = laneHeight - 2

  return (
    <div
      style={{ left, width, top, height }}
      className={cn(
        "group absolute flex flex-col justify-between rounded-xl",
        "border border-border/50 bg-card px-3 py-2 shadow-sm select-none",
        "transition-all hover:border-border/80 hover:bg-accent/10 hover:shadow-md",
        readOnly ? "cursor-default" : "cursor-grab active:cursor-grabbing",
        // ✅ Harakatlanayotganda kartani boshqalardan ustun qilib, yoritib qo'yamiz
        isInteracting
          ? "z-50 opacity-90 shadow-lg ring-2 ring-primary/50 transition-none"
          : "z-10 duration-200"
      )}
      // Zamonaviy Pointer event (Mobile & Desktop)
      onPointerDown={(e) => onPointerDown(e, "move")}
    >
      {/* Title + subtitle */}
      <div className="pointer-events-none min-w-0">
        <p className="truncate text-xs font-semibold text-foreground/90">
          {event.title}
        </p>
        {event.subtitle && (
          <p className="truncate text-[10px] text-muted-foreground">
            {event.subtitle}
          </p>
        )}
      </div>

      {/* Time display / Edit */}
      {!readOnly && onMove ? (
        <TimelineTimeEditDialog
          event={event}
          rows={rows}
          onSave={(start, end) => onMove(event.id, start, end)}
          onRowChange={
            onRowChange
              ? (newRowId) => onRowChange(event.id, newRowId)
              : undefined
          }
        />
      ) : (
        <span className="pointer-events-none flex items-center gap-0.5 text-[10px] text-muted-foreground">
          <Clock className="h-2.5 w-2.5" />
          {event.startTime} – {event.endTime}
        </span>
      )}

      {/* Remove (O'chirish) tugmasi */}
      {!readOnly && onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onPointerDown={(e) => e.stopPropagation()} // Drag bilan koflikt qilmasligi uchun
          onClick={() => onRemove(event.id)}
          className="pointer-events-auto absolute top-1 right-1 hidden h-4 w-4 text-destructive group-hover:flex hover:bg-destructive/10"
        >
          <X className="h-2.5 w-2.5" />
        </Button>
      )}

      {/* Resize (Cho'zish) uchun maxsus hudud */}
      {!readOnly && onMove && (
        <div
          onPointerDown={(e) => onPointerDown(e, "resize")}
          className="absolute top-0 right-0 h-full w-3 cursor-ew-resize rounded-r-xl opacity-0 transition-opacity hover:bg-primary/30 hover:opacity-100 active:bg-primary/40 active:opacity-100"
        />
      )}
    </div>
  )
}
