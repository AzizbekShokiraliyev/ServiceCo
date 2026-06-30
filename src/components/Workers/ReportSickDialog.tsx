import { useState } from "react"
import { ThermometerSun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { useReportSickLeave } from "@/hooks/useReportSickLeave"

interface ReportSickDialogProps {
  technicianId?: string
}

export function ReportSickDialog({ technicianId }: ReportSickDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const { submit, isSubmitting } = useReportSickLeave()

  const handleSubmit = async () => {
    const success = await submit({ technicianId, reason })
    if (success) {
      setReason("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        className="gap-2 border-amber-500/40 text-amber-600 hover:bg-amber-500/10 hover:text-amber-600"
        onClick={() => setOpen(true)}
      >
        <ThermometerSun className="h-4 w-4" />
        Kasalman
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kasallik haqida xabar berish</DialogTitle>
          <DialogDescription>
            Sababini yozing — bu xabar adminga yuboriladi.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Masalan: harorat ko'tarildi, shifokorga borishim kerak..."
          rows={4}
          disabled={isSubmitting}
        />

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Bekor qilish
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Yuborilmoqda..." : "Yuborish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
