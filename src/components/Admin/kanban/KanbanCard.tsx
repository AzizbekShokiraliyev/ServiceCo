import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { KanbanCardProps } from "@/interface/Interface"
import { User } from "lucide-react"
import { Card } from "@/components/ui/card"

export const KanbanCard = ({ deal }: KanbanCardProps) => {
  const {
    listeners,
    setNodeRef,
    transform,
    transition,
    attributes,
    isDragging,
  } = useSortable({
    id: deal.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? "pointer-events-none opacity-30" : ""}
    >
      <div className="cursor-grab transition-all duration-200 active:cursor-grabbing">
        <Card className="flex flex-col gap-2 rounded-xl border border-border/50 bg-card p-3.5 shadow-sm transition-all duration-200 hover:border-border/80 hover:bg-accent/10 hover:shadow-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60" />
              <span className="max-w-[120px] truncate font-semibold">
                {deal.client}
              </span>
            </div>
            <span className="flex-shrink-0 rounded bg-muted/60 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-muted-foreground/40 uppercase">
              {deal.id}
            </span>
          </div>

          <h4 className="text-sm leading-snug font-semibold tracking-tight text-foreground/90">
            {deal.title}
          </h4>
        </Card>
      </div>
    </div>
  )
}
