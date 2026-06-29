import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { User } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { KanbanDeal } from "@/interface/Interface"

interface TimelineCardProps {
  deal: KanbanDeal
  isOverlay?: boolean
}

export const TimelineCard = ({ deal, isOverlay }: TimelineCardProps) => {
  const { setNodeRef, transform, attributes, listeners, isDragging } =
    useDraggable({ id: deal.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...attributes}
      {...listeners}
      className={`touch-none ${isDragging && !isOverlay ? "opacity-30" : ""}`}
    >
      <Card className="flex cursor-grab flex-col gap-2 rounded-xl border border-border/50 bg-card p-3.5 shadow-sm transition-all duration-200 hover:border-border/80 hover:shadow-md active:cursor-grabbing">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          <span className="max-w-[120px] truncate font-semibold">
            {deal.client}
          </span>
        </div>

        <h4 className="text-sm leading-snug font-semibold tracking-tight text-foreground/90">
          {deal.title}
        </h4>
      </Card>
    </div>
  )
}
