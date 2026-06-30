import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { useTechnicianDelete } from "@/hooks/useTechnicians"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import WorkerFormDialog from "./actionWorker/WorkerFormDialog"
import type { Technician } from "@/interface/Interface"

interface MastersActionsProps {
  worker: Technician
}

export default function MastersActions({ worker }: MastersActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const { mutate: deleteTechnician } = useTechnicianDelete()

  return (
    <>
      <ButtonGroup className="ml-auto w-fit">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <ButtonGroupSeparator />
        <ConfirmDialog
          trigger={
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          }
          title="Ishchini o'chirish"
          description={`"${worker.full_name}" ni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.`}
          onConfirm={() => deleteTechnician(worker.id)}
        />
      </ButtonGroup>

      <WorkerFormDialog
        mode="edit"
        worker={worker}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  )
}
