import React, { useRef } from "react"
import { useDroppable } from "@dnd-kit/core"
import {
  HOURS,
  HOUR_WIDTH,
  TOTAL_WIDTH,
  ROW_HEIGHT,
  NAME_COL_WIDTH,
  getRowHeight,
} from "@/components/Admin/kanban/constants/timeLineConstants"
import type {
  TimelineRow,
  TimelineEvent,
  TimelineGridRowProps,
  TimelineProps,
} from "@/interface/Interface"
import { TimelineBlock } from "./TimeLineBlock"
import { assignLanes } from "./utils/timelineUtils"

export { HOURS, HOUR_WIDTH, TOTAL_WIDTH, ROW_HEIGHT, NAME_COL_WIDTH }
export type { TimelineRow, TimelineEvent }

const TimelineGridRow = ({
  row,
  positionedEvents,
  dynamicHeight,
  readOnly,
  onEventMove,
  onEventRemove,
  onEventRowChange,
  rows,
}: TimelineGridRowProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `timeline-${row.id}`,
    disabled: readOnly,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ width: TOTAL_WIDTH, height: dynamicHeight }}
      className={`relative border-b border-border/30 last:border-0 ${
        row.isSick ? "bg-red-500/10" : isOver ? "bg-primary/5" : ""
      }`}
    >
      {row.isSick && (
        <span
          title={row.sickReason}
          className="pointer-events-none absolute top-1 left-2 z-10 flex items-center gap-1 text-[10px] font-medium text-red-600"
        >
          Kasal
        </span>
      )}

      {HOURS.map((h) => (
        <div
          key={h}
          style={{ left: h * HOUR_WIDTH }}
          className="pointer-events-none absolute top-0 h-full w-px bg-border/20"
        />
      ))}

      {positionedEvents.map((event) => (
        <TimelineBlock
          key={event.id}
          event={event}
          rows={rows}
          readOnly={readOnly}
          onMove={onEventMove}
          onRemove={onEventRemove}
          onRowChange={onEventRowChange}
        />
      ))}
    </div>
  )
}

// Interfeysga yangi prop qo'shib ketamiz (& { hideNameColumn?: boolean })
export const Timeline = ({
  rows,
  events,
  height = "h-[500px]",
  readOnly = false,
  hideNameColumn = false, // <-- YANGI PROP QO'SHILDI
  onEventMove,
  onEventRemove,
  onEventRowChange,
}: TimelineProps & { hideNameColumn?: boolean }) => {
  const bodyScrollRef = useRef<HTMLDivElement>(null)
  const headerScrollRef = useRef<HTMLDivElement>(null)
  const nameScrollRef = useRef<HTMLDivElement>(null)

  const onBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    if (headerScrollRef.current)
      headerScrollRef.current.scrollLeft = el.scrollLeft
    if (nameScrollRef.current && !hideNameColumn)
      nameScrollRef.current.scrollTop = el.scrollTop
  }

  const rowData = rows.map((row) => {
    const rowEvents = events.filter((e) => e.rowId === row.id)
    const positioned = assignLanes(rowEvents)
    const laneCount = positioned[0]?.laneCount ?? 1
    const dynamicHeight = getRowHeight(laneCount)
    return { row, positioned, dynamicHeight }
  })

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border border-border/40 ${height}`}
    >
      <div className="flex shrink-0 border-b border-border/30 bg-muted/40">
        {/* CHAP TOMON HEADERI: Agar hideNameColumn true bo'lmasa ko'rsatiladi */}
        {!hideNameColumn && (
          <div
            style={{ width: NAME_COL_WIDTH, minWidth: NAME_COL_WIDTH }}
            className="shrink-0 border-r border-border/30"
          />
        )}
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
        {/* CHAP TOMON ISMLAR USTUNI: Agar hideNameColumn true bo'lmasa ko'rsatiladi */}
        {!hideNameColumn && (
          <div
            ref={nameScrollRef}
            style={{ width: NAME_COL_WIDTH, minWidth: NAME_COL_WIDTH }}
            className="shrink-0 overflow-hidden border-r border-border/30 bg-background"
          >
            {rowData.map(({ row, dynamicHeight }) => (
              <div
                key={row.id}
                style={{ height: dynamicHeight }}
                className="flex items-center gap-2 border-b border-border/30 px-3 last:border-0"
              >
                {row.avatarChar && (
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      row.isSick
                        ? "bg-red-500/10 text-red-600"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
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
        )}

        <div
          ref={bodyScrollRef}
          className={`flex-1 scrollbar-thin overflow-auto ${
            readOnly ? "cursor-default" : "cursor-crosshair"
          }`}
          onScroll={onBodyScroll}
        >
          <div style={{ width: TOTAL_WIDTH }}>
            {rowData.map(({ row, positioned, dynamicHeight }) => (
              <TimelineGridRow
                key={row.id}
                row={row}
                rows={rows}
                positionedEvents={positioned}
                dynamicHeight={dynamicHeight}
                readOnly={readOnly}
                onEventMove={onEventMove}
                onEventRemove={onEventRemove}
                onEventRowChange={onEventRowChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
