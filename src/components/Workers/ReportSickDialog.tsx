import { useState } from "react"
import { ThermometerSun, CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { useSickReportCreate } from "@/hooks/Usesickreports"
import { toast } from "sonner"
import type { ReportSickDialogProps } from "@/interface/Interface"

const toDateKey = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const formatDisplay = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`

export function ReportSickDialog({ technicianId }: ReportSickDialogProps) {
  const [open, setOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [range, setRange] = useState<DateRange | undefined>()
  const [reason, setReason] = useState("")

  const { mutate: createSickReport, isPending } = useSickReportCreate()

  const reset = () => {
    setRange(undefined)
    setReason("")
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) reset()
  }

  const handleSubmit = () => {
    if (!technicianId) {
      toast.error("Texnik profili topilmadi")
      return
    }
    if (!range?.from) {
      toast.error("Kasallik boshlanish sanasini tanlang")
      return
    }

    const from = range.from
    const to = range.to ?? range.from

    createSickReport(
      {
        technician_id: technicianId,
        reason: reason.trim() || "Sabab ko'rsatilmagan",
        start_date: toDateKey(from),
        end_date: toDateKey(to),
      },
      {
        onSuccess: () => {
          toast.success("Kasallik xabari yuborildi", {
            description:
              "Sizga tayinlangan faol ishlar bo'sh ustalar ro'yxatiga qaytarildi.",
          })
          handleOpenChange(false)
        },
        onError: (error) => {
          toast.error("Xatolik", {
            description:
              error instanceof Error
                ? error.message
                : "Qaytadan urinib ko'ring.",
          })
        },
      }
    )
  }

  const rangeLabel =
    range?.from && range?.to
      ? `${formatDisplay(range.from)} – ${formatDisplay(range.to)}`
      : range?.from
        ? formatDisplay(range.from)
        : "Sanani tanlang"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        variant="outline"
        className="gap-2 border-amber-500/40 text-amber-600 hover:bg-amber-500/10 hover:text-amber-600"
        onClick={() => setOpen(true)}
        disabled={!technicianId}
      >
        <ThermometerSun className="h-4 w-4" />
        Kasalman
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kasallik haqida xabar berish</DialogTitle>
          <DialogDescription>
            Necha kun kasal bo&apos;lishingizni belgilang — shu muddatda sizga
            yangi ish tayinlanmaydi va joriy ishlaringiz boshqa ustaga
            o&apos;tkaziladi.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Kasallik muddati</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {rangeLabel}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  numberOfMonths={1}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sick-reason">Sabab</Label>
            <Textarea
              id="sick-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Masalan: harorat ko'tarildi, shifokorga borishim kerak..."
              rows={4}
              disabled={isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Bekor qilish
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Yuborilmoqda..." : "Yuborish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
