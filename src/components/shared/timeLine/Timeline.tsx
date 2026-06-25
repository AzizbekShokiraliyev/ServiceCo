import { useRef } from "react"
import { Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const HOUR_WIDTH = 80
const TOTAL_WIDTH = HOUR_WIDTH * 24
const ROW_HEIGHT = 72
const NAME_COL_WIDTH = 160

const timeToMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

const minutesToTime = (mins: number) => {
  const clamped = Math.max(0, Math.min(1439, mins))
  const h = Math.floor(clamped / 60)
  const m = clamped % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

export interface TimelineRow {
  id: string
  label: string
  sublabel?: string
  avatarChar?: string
}

export interface TimelineEvent {
  id: string
  rowId: string
  title: string
  subtitle?: string
  startTime: string
  endTime: string
}

interface TimelineBlockProps {
  event: TimelineEvent
  onRemove?: (id: string) => void
  onMove?: (id: string, startTime: string, endTime: string) => void
  readOnly?: boolean
}

const TimelineBlock = ({
  event,
  onRemove,
  onMove,
  readOnly,
}: TimelineBlockProps) => {
  const startMins = timeToMinutes(event.startTime)
  const endMins = timeToMinutes(event.endTime)
  const durationMins = Math.max(30, endMins - startMins)
  const left = (startMins / 60) * HOUR_WIDTH
  const width = (durationMins / 60) * HOUR_WIDTH

  const dragRef = useRef<{
    type: "move" | "resize"
    startX: number
    origStart: number
    origEnd: number
  } | null>(null)

  const startDrag = (e: React.MouseEvent, type: "move" | "resize") => {
    if (readOnly || !onMove) return
    e.preventDefault()
    e.stopPropagation()
    dragRef.current = {
      type,
      startX: e.clientX,
      origStart: startMins,
      origEnd: endMins,
    }

    const onMouseMove = (me: MouseEvent) => {
      if (!dragRef.current) return
      const dx = me.clientX - dragRef.current.startX
      const deltaMins = Math.round(((dx / HOUR_WIDTH) * 60) / 15) * 15
      const dur = dragRef.current.origEnd - dragRef.current.origStart
      if (type === "move") {
        const newStart = Math.max(
          0,
          Math.min(1440 - dur, dragRef.current.origStart + deltaMins)
        )
        onMove(event.id, minutesToTime(newStart), minutesToTime(newStart + dur))
      } else {
        const newEnd = Math.max(
          dragRef.current.origStart + 30,
          Math.min(1440, dragRef.current.origEnd + deltaMins)
        )
        onMove(
          event.id,
          minutesToTime(dragRef.current.origStart),
          minutesToTime(newEnd)
        )
      }
    }

    const onMouseUp = () => {
      dragRef.current = null
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  return (
    <div
      style={{ left, width, top: 8, height: ROW_HEIGHT - 16 }}
      className={`group absolute flex flex-col justify-between rounded-lg border border-primary/30 bg-primary/10 px-2 py-1.5 shadow-sm select-none ${
        readOnly ? "cursor-default" : "cursor-grab active:cursor-grabbing"
      }`}
      onMouseDown={(e) => startDrag(e, "move")}
    >
      <div className="pointer-events-none">
        <p className="truncate text-[11px] font-semibold text-foreground/90">
          {event.title}
        </p>
        {event.subtitle && (
          <p className="truncate text-[10px] text-muted-foreground">
            {event.subtitle}
          </p>
        )}
      </div>
      <span className="pointer-events-none flex items-center gap-0.5 text-[10px] text-muted-foreground">
        <Clock className="h-2.5 w-2.5" />
        {event.startTime} – {event.endTime}
      </span>

      {!readOnly && onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => {
            e.stopPropagation()
            onRemove(event.id)
          }}
          className="pointer-events-auto absolute top-1 right-1 hidden h-4 w-4 text-destructive group-hover:flex hover:bg-destructive/10"
        >
          <X className="h-2.5 w-2.5" />
        </Button>
      )}

      {!readOnly && onMove && (
        <div
          onMouseDown={(e) => startDrag(e, "resize")}
          className="absolute top-0 right-0 h-full w-2 cursor-ew-resize rounded-r-lg hover:bg-primary/30"
        />
      )}
    </div>
  )
}

interface TimelineProps {
  rows: TimelineRow[]
  events: TimelineEvent[]
  height?: string
  readOnly?: boolean
  onEventMove?: (id: string, startTime: string, endTime: string) => void
  onEventRemove?: (id: string) => void
}

export const Timeline = ({
  rows,
  events,
  height = "h-[500px]",
  readOnly = false,
  onEventMove,
  onEventRemove,
}: TimelineProps) => {
  const bodyScrollRef = useRef<HTMLDivElement>(null)
  const headerScrollRef = useRef<HTMLDivElement>(null)
  const nameScrollRef = useRef<HTMLDivElement>(null)

  const onBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    if (headerScrollRef.current)
      headerScrollRef.current.scrollLeft = el.scrollLeft
    if (nameScrollRef.current) nameScrollRef.current.scrollTop = el.scrollTop
  }

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border border-border/40 ${height}`}
    >
      <div className="flex shrink-0 border-b border-border/30 bg-muted/40">
        <div
          style={{ width: NAME_COL_WIDTH, minWidth: NAME_COL_WIDTH }}
          className="shrink-0 border-r border-border/30"
        />
        <div ref={headerScrollRef} className="flex-1 overflow-x-hidden">
          <div style={{ width: TOTAL_WIDTH }} className="flex">
            {HOURS.map((h) => (
              <div
                key={h}
                style={{ width: HOUR_WIDTH }}
                className="shrink-0 border-r border-border/20 py-2 text-center text-[10px] font-medium text-muted-foreground"
              >
                {String(h).padStart(2, "0")}:00
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          ref={nameScrollRef}
          style={{ width: NAME_COL_WIDTH, minWidth: NAME_COL_WIDTH }}
          className="shrink-0 overflow-hidden border-r border-border/30 bg-background"
        >
          {rows.map((row) => (
            <div
              key={row.id}
              style={{ height: ROW_HEIGHT }}
              className="flex items-center gap-2 border-b border-border/30 px-3 last:border-0"
            >
              {row.avatarChar && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {row.avatarChar}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground/90">
                  {row.label}
                </p>
                {row.sublabel && (
                  <p className="text-[10px] text-muted-foreground">
                    {row.sublabel}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          ref={bodyScrollRef}
          className={`flex-1 scrollbar-thin overflow-auto ${readOnly ? "cursor-default" : "cursor-crosshair"}`}
          onScroll={onBodyScroll}
        >
          <div style={{ width: TOTAL_WIDTH }}>
            {rows.map((row) => {
              const rowEvents = events.filter((e) => e.rowId === row.id)
              return (
                <div
                  key={row.id}
                  style={{ width: TOTAL_WIDTH, height: ROW_HEIGHT }}
                  className="relative border-b border-border/30 last:border-0"
                >
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      style={{ left: h * HOUR_WIDTH }}
                      className="absolute top-0 h-full w-px bg-border/20"
                    />
                  ))}
                  {rowEvents.map((event) => (
                    <TimelineBlock
                      key={event.id}
                      event={event}
                      readOnly={readOnly}
                      onMove={onEventMove}
                      onRemove={onEventRemove}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
