"use client"

import { useState } from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useSickReportCreate } from "@/hooks/Usesickreports"
import { useProfile } from "@/hooks/useProfile"
import { toast } from "sonner"
import { Calendar } from "../ui/calendar"

const toDateKey = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const formatDisplay = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`

export function SickLeaveForm() {
  const { data: profile } = useProfile()
  const { mutate: createSickReport, isPending } = useSickReportCreate()

  const [range, setRange] = useState<DateRange | undefined>()
  const [reason, setReason] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = () => {
    if (!profile?.id) return

    if (!range?.from) {
      toast.error("Kasallik boshlanish sanasini tanlang")
      return
    }

    const from = range.from
    const to = range.to ?? range.from

    createSickReport(
      {
        technician_id: profile.id,
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
          setRange(undefined)
          setReason("")
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
    <div className="space-y-4 rounded-xl border p-4">
      <div>
        <h3 className="text-sm font-semibold">Kasallik haqida xabar berish</h3>
        <p className="text-xs text-muted-foreground">
          Necha kun kasal bo'lishingizni belgilang — shu muddatda sizga yangi
          ish tayinlanmaydi va joriy ishlaringiz boshqa ustaga o'tkaziladi.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>Kasallik muddati</Label>
        <Popover open={open} onOpenChange={setOpen}>
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
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sick-reason">Sabab (ixtiyoriy)</Label>
        <Textarea
          id="sick-reason"
          placeholder="Masalan: gripp, shifokor ko'rigi..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <Button onClick={handleSubmit} disabled={isPending} className="w-full">
        {isPending ? "Yuborilmoqda..." : "Kasallik haqida xabar berish"}
      </Button>
    </div>
  )
}
