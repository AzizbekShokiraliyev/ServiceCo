import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Lock } from "lucide-react"
import { KanbanCard } from "./KanbanCard"
import type { KanbanColumnProps } from "@/interface/Interface"
import { useKanban } from "./context/KanbanContext"

export const KanbanColumn = ({
  status,
  heightClass = "h-[280px]",
  widthClass = "w-52",
  emptyText = "Drop here",
  emptyVariant = "drop",
  subtitle,
  isDropDisabled = false,
}: KanbanColumnProps) => {
  const { deals, unassignedDeals } = useKanban()

  const columnDeals =
    status === "Works"
      ? unassignedDeals
      : deals.filter((d) => d.status === status)

  const { setNodeRef, isOver } = useDroppable({
    id: status,
    disabled: isDropDisabled,
  })

  const borderBg =
    isOver && !isDropDisabled
      ? "border-primary/60 bg-accent/40 shadow-sm"
      : isDropDisabled
        ? "border-muted-foreground/10 bg-muted/20 opacity-90"
        : "border-border/40 bg-muted/30"

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-shrink-0 flex-col rounded-xl border p-4 transition-all duration-200 ${heightClass} ${widthClass} ${borderBg}`}
    >
      <div className="mb-4 px-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold tracking-wider text-foreground/80 uppercase">
              {status}
            </h3>
            {isDropDisabled && (
              <Lock className="h-3 w-3 text-muted-foreground/60" />
            )}
          </div>

          <span className="rounded-md border border-border/20 bg-background px-2 py-0.5 text-xs font-medium text-foreground/70 shadow-sm">
            {columnDeals.length}
          </span>
        </div>

        {subtitle && (
          <span className="text-[11px] font-medium text-muted-foreground/60">
            {subtitle}
          </span>
        )}
      </div>

      <SortableContext
        items={columnDeals.map((d) => d.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 scrollbar-thin space-y-3 overflow-y-auto p-0.5 select-none">
          {columnDeals.map((deal) => (
            <KanbanCard key={deal.id} deal={deal} editable />
          ))}

          {columnDeals.length === 0 &&
            (emptyVariant === "drop" && !isDropDisabled ? (
              <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border/60 bg-background/20 text-xs text-muted-foreground/50">
                {emptyText}
              </div>
            ) : (
              <div className="flex h-20 items-center justify-center text-xs text-muted-foreground/40 italic">
                {isDropDisabled ? "Hammasi tayinlangan" : emptyText}
              </div>
            ))}
        </div>
      </SortableContext>
    </div>
  )
}
