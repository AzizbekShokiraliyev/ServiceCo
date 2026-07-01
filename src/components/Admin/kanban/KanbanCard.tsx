import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { DealTimeDialog } from "./DealTimeDialog"
import { RejectJobDialog } from "./RejectJobDialog" // <--- Import qildik
import { getDealTimeStatus } from "@/lib/getDealTimeStatus"
import { cn } from "@/lib/utils"
import type { KanbanCardProps } from "@/interface/Interface"
import { useKanban } from "./context/KanbanContext"

export const KanbanCard = ({ deal, editable = false }: KanbanCardProps) => {
  const { handleTimeChange } = useKanban()
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
      <Card className={cn("flex flex-col gap-2 p-3.5", timeStatus)}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            <span className="max-w-[120px] truncate font-semibold">
              {deal.client}
            </span>
          </div>

          {deal.status === "Works" && <RejectJobDialog dealId={deal.id} />}
        </div>

        <h4 className="text-sm leading-snug font-semibold tracking-tight text-foreground/90">
          {deal.title}
        </h4>

        {editable && (
          <div className="mt-1">
            <DealTimeDialog
              startTime={deal.startTime}
              endTime={deal.endTime}
              onSave={(start, end) => handleTimeChange(deal.id, start, end)}
            />
          </div>
        )}
      </Card>
    </div>
  )
}
