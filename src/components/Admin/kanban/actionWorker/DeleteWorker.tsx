import { useState } from "react"
import { Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Technician } from "@/interface/Interface"
import { ConfirmDialog } from "./ConfirmDialogProps "

const SKILL_LABELS: Record<string, string> = {
  Electrical: "Elektrik",
  Plumbing: "Santexnik",
  HVAC: "Konditsioner",
}

interface DeleteWorkerProps {
  workers: Technician[]
  onDelete: (id: string) => void
}

const DeleteWorker = ({ workers, onDelete }: DeleteWorkerProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Users className="mr-1.5 h-4 w-4" /> Ishchilar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Ishchilarni boshqarish</DialogTitle>
        </DialogHeader>

        <div className="mt-4 overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-3 text-left font-medium">Ism</th>
                <th className="p-3 text-left font-medium">Yo'nalish</th>
                <th className="p-3 text-right font-medium">Amal</th>
              </tr>
            </thead>
            <tbody>
              {workers.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-4 text-center text-muted-foreground"
                  >
                    Ishchilar yo'q.
                  </td>
                </tr>
              ) : (
                workers.map((worker) => (
                  <tr key={worker.id} className="border-t">
                    <td className="p-3 font-medium">{worker.name}</td>
                    <td className="p-3 text-muted-foreground">
                      {SKILL_LABELS[worker.skill] || worker.skill}
                    </td>
                    <td className="p-3 text-right">
                      <ConfirmDialog
                        trigger={
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive/90"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                        title="Ishchini o'chirish"
                        description={`"${worker.name}" ni o'chirmoqchimisiz? Unga tayinlangan barcha ishlar "Tayinlanmagan ishlar" ustuniga qaytariladi.`}
                        onConfirm={() => onDelete(worker.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteWorker
