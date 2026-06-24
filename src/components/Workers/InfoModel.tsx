import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, SendHorizontal } from "lucide-react"

interface InfoModalProps {
  // FIX: optional callback so parent can react to submission if needed
  onSubmit?: (data: { reason: string; duration: string }) => void
}

export default function InfoModal({ onSubmit }: InfoModalProps) {
  const [open, setOpen] = useState(false)
  // FIX: controlled inputs so we can read & reset values
  const [reason, setReason] = useState("")
  const [duration, setDuration] = useState("")

  // FIX: replaced <form onSubmit> with a plain handler — no accidental page reloads
  function handleSubmit() {
    if (!reason.trim()) return
    onSubmit?.({ reason, duration })
    setReason("")
    setDuration("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          Xabar <SendHorizontal className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Ish haqida ma&apos;lumot</DialogTitle>
        </DialogHeader>

        {/* FIX: div instead of <form> — no unwanted submit/reload behaviour */}
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="reason">Nima buzilgan? (Sabab)</Label>
            <Textarea
              id="reason"
              placeholder="Muammo tafsilotlarini yozing..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="duration">Taxminiy vaqt</Label>
            <div className="relative flex items-center">
              <Clock className="pointer-events-none absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="duration"
                className="pl-9"
                placeholder="Masalan: 2 soat"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleSubmit} disabled={!reason.trim()}>
              Yuborish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
