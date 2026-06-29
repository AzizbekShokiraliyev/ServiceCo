import { Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Agar loyihangizdagi DeleteWorker ni ishlatmoqchi bo'lsangiz, buni commentdan chiqaring:
// import DeleteWorker from "../kanban/actionWorker/DeleteWorker"

interface MastersActionsProps {
  workerId: string
}

export default function MastersActions({ workerId }: MastersActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1 opacity-50 transition-opacity group-hover:opacity-100">
      {/* Tahrirlash tugmasi */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
        onClick={() => console.log("Edit bosildi. ID:", workerId)}
      >
        <Edit2 className="h-4 w-4" />
        <span className="sr-only">Tahrirlash</span>
      </Button>

      {/* 
        Agar o'zingizning faylingizni ishlatsangiz, pastdagi Button o'rniga shuni qo'ying: 
        <DeleteWorker workerId={workerId} /> 
      */}

      {/* O'chirish tugmasi */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        onClick={() => console.log("Delete bosildi. ID:", workerId)}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">O'chirish</span>
      </Button>
    </div>
  )
}
