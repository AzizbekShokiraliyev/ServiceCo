// src/components/Admin/kanban/timeline/TimelineView.tsx
import { Badge } from "@/components/ui/badge"
import {
  Timeline,
  type TimelineRow,
  type TimelineEvent,
} from "@/components/Admin/kanban/timeline/Timeline"
import type { KanbanDeal, Technician } from "@/interface/Interface"
import { LAYOUT } from "../constants/kanbanConstants"
import { KanbanCard } from "../KanbanCard"

// ✅ Utils dan tekshiruvchi funksiyani chaqiramiz
import { hasTimeConflict } from "./utils/timelineUtils"
import { toast } from "sonner" // ✅ Sonner kutubxonasidan import qilingan

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
      // ⚠️ DIQQAT: Agar qatorlar 'full_name' bo'lsa, 'status' emas xodim ismi kelishi kerak.
      // Backenddan nima kelsa shunga moslang (masalan: d.technicianName)
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
  const events = toEvents(deals)
  const rows = toRows(technicians)

  // ─── 1. KARTA VAQTINI O'ZGARTIRISH (YOKI CHO'ZISH) UCHUN WRAPPER ───
  const handleTimeMove = (
    id: string,
    newStartTime: string,
    newEndTime: string
  ) => {
    const event = events.find((e) => e.id === id)
    if (!event) return

    // Ustaning aynan shu vaqtda boshqa ishi bor-yo'qligini tekshirish
    const isConflict = hasTimeConflict(
      events,
      event.rowId,
      newStartTime,
      newEndTime,
      id
    )

    if (isConflict) {
      // ✅ alert va window.toast o'rniga toast.error ishlatildi
      toast.error(
        "Bu ustaning tanlangan vaqt oralig'ida boshqa ishi bor! Iltimos, boshqa bo'sh vaqt tanlang."
      )
      return // Saqlash to'xtatiladi, karta eski joyiga qaytadi
    }

    // Hammasi joyida, saqlaymiz
    onTimeMove(id, newStartTime, newEndTime)
  }

  const handleRowChange = (id: string, newRowId: string) => {
    const event = events.find((e) => e.id === id)
    if (!event) return

    const isConflict = hasTimeConflict(
      events,
      newRowId,
      event.startTime,
      event.endTime,
      id
    )

    if (isConflict) {
      toast.error(
        "Yangi tanlangan usta bu vaqtda band! Iltimos, boshqa ustani tanlang."
      )
      return
    }

    onRowChange(id, newRowId)
  }

  return (
    <div className={`flex ${LAYOUT.BOARD_HEIGHT} gap-4`}>
      <div
        className={`flex ${LAYOUT.UNASSIGNED_WIDTH} shrink-0 flex-col rounded-xl border border-border/40 bg-muted/30 p-3`}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider text-foreground/80 uppercase">
            Works
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
            unassigned.map((deal) => <KanbanCard key={deal.id} deal={deal} />)
          )}
        </div>
      </div>

      <div className="relative min-w-0 flex-1">
        <Timeline
          rows={rows}
          events={events}
          height={LAYOUT.BOARD_HEIGHT}
          onEventMove={handleTimeMove}
          onEventRemove={onRemoveFromTimeline}
          onEventRowChange={handleRowChange}
        />
      </div>
    </div>
  )
}
