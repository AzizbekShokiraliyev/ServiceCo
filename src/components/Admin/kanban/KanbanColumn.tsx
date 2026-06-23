import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanCard } from "./KanbanCard"
import type { KanbanColumnProps } from "@/interface/Interface"
import { Lock } from "lucide-react"

export const KanbanColumn = ({
  status,
  deals,
  heightClass = "h-[calc(100vh-220px)]",
  widthClass = "w-80",
  emptyText = "Drop here",
  emptyVariant = "drop",
  subtitle,
  isDropDisabled = false,
}: KanbanColumnProps & {
  heightClass?: string
  widthClass?: string
  emptyText?: string
  emptyVariant?: "drop" | "info"
  subtitle?: string
  isDropDisabled?: boolean
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    disabled: isDropDisabled,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex ${heightClass} ${widthClass} flex-shrink-0 flex-col rounded-xl border transition-all duration-200 ${
        isOver && !isDropDisabled
          ? "border-primary/60 bg-accent/40 shadow-sm"
          : isDropDisabled
            ? "border-muted-foreground/10 bg-muted/20 opacity-90"
            : "border-border/40 bg-muted/30"
      } p-4`}
    >
      <div className="mb-4 px-1">
        <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold tracking-wider text-foreground/80 uppercase">
              {status}
            </h3>
            {isDropDisabled && (
              <span className="text-[10px] text-muted-foreground/60" title="Drop disabled">
                <Lock className="h-3 w-3 inline" />
              </span>
            )}
          </div>
          <span className="rounded-md bg-background px-2 py-0.5 text-xs font-medium border border-border/20 shadow-sm text-foreground/70">
            {deals.length}
          </span>
        </div>
        {subtitle && (
          <span className="text-[11px] font-medium text-muted-foreground/60">
            {subtitle}
          </span>
        )}
      </div>

      <SortableContext
        items={deals.map((d) => d.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 scrollbar-thin space-y-3 overflow-y-auto p-0.5 select-none">
          {deals.map((deal) => (
            <KanbanCard
              key={deal.id}
              deal={deal}
            />
          ))}

          {deals.length === 0 &&
            (emptyVariant === "drop" && !isDropDisabled ? (
              <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground/50 bg-background/20">
                {emptyText}
              </div>
            ) : (
              <div className="flex h-20 items-center justify-center text-xs text-muted-foreground/40 italic">
                {isDropDisabled ? "Only drag out" : emptyText}
              </div>
            ))}
        </div>
      </SortableContext>
    </div>
  )
}

