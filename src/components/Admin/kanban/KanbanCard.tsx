import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { DealTimeDialog } from "./DealTimeDialog"
import { getDealTimeStatus } from "@/lib/getDealTimeStatus"
import { cn } from "@/lib/utils"
import type { KanbanCardProps } from "@/interface/Interface"

export const KanbanCard = ({ deal, onTimeChange }: KanbanCardProps) => {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({ id: deal.id })

  const timeStatus = getDealTimeStatus(deal.startTime, deal.endTime)

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={isDragging ? "pointer-events-none opacity-30" : "touch-none"}
    >
      <Card className={cn("p-3.5", timeStatus)}>
        {/* Client name */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          <span className="max-w-[120px] truncate font-semibold">
            {deal.client}
          </span>
        </div>

        {/* Job title */}
        <h4 className="text-sm leading-snug font-semibold tracking-tight text-foreground/90">
          {deal.title}
        </h4>

        {/* Time picker — only shown when column supports it */}
        {onTimeChange && (
          <DealTimeDialog
            startTime={deal.startTime}
            endTime={deal.endTime}
            onSave={(start, end) => onTimeChange(deal.id, start, end)}
          />
        )}
      </Card>
    </div>
  )
}
