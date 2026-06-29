import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import type { KanbanDeal } from "@/interface/Interface"

interface TimelineCardProps {
  deal: KanbanDeal
  isOverlay?: boolean
}

export const TimelineCard = ({ deal, isOverlay }: TimelineCardProps) => {
  const { setNodeRef, transform, attributes, listeners, isDragging } =
    useDraggable({
      id: deal.id,
    })

  const initials = deal.client
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...attributes}
      {...listeners}
      className={`touch-none ${isDragging && !isOverlay ? "opacity-30" : ""}`}
    >
      <Card className="hover:border-border-strong flex cursor-grab flex-col gap-1.5 rounded-[10px] border border-border p-3 shadow-none transition-[border-color,box-shadow] hover:shadow-sm active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[9px] font-medium text-accent">
            {initials}
          </div>
          <span className="max-w-[160px] truncate text-[11px] text-muted-foreground">
            {deal.client}
          </span>
        </div>
        <p className="text-[13px] leading-snug font-medium text-foreground">
          {deal.title}
        </p>
      </Card>
    </div>
  )
}
