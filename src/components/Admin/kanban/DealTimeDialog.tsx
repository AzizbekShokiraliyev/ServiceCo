import { useState } from "react"
import type React from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  validateTimeRange,
  timeToMinutes,
  minutesToTime,
} from "./timeline/utils/timelineUtils"
import type { DealTimeDialogProps } from "@/interface/Interface"

const DURATIONS = [
  { label: "30 daq", value: 30 },
  { label: "1 soat", value: 60 },
  { label: "1.5 soat", value: 90 },
  { label: "2 soat", value: 120 },
]

export const DealTimeDialog = ({
  startTime,
  endTime,
  onSave,
}: DealTimeDialogProps) => {
  const [open, setOpen] = useState(false)
  const [start, setStart] = useState(startTime ?? "")
  const [end, setEnd] = useState(endTime ?? "")
  const [error, setError] = useState("")

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) {
      setStart(startTime ?? "")
      setEnd(endTime ?? "")
      setError("")
    }
  }

  // Boshlanish vaqti o'zgarganda, tugash vaqtini ham avtomat siljitish mantiqi
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value
    if (start && end && newStart) {
      const diff = timeToMinutes(end) - timeToMinutes(start)
      if (diff > 0) {
        setEnd(minutesToTime(timeToMinutes(newStart) + diff))
      }
    } else if (newStart && !end) {
      setEnd(minutesToTime(timeToMinutes(newStart) + 60)) // Default 1 soat
    }
    setStart(newStart)
  }

  const setDuration = (mins: number) => {
    if (!start) return
    setEnd(minutesToTime(timeToMinutes(start) + mins))
    setError("")
  }

  const handleSave = () => {
    const err = validateTimeRange(start, end)
    if (err) {
      setError(err)
      return
    }
    setError("")
    onSave(start, end)
    setOpen(false)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (e.key === "Enter") handleSave()
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-6 w-fit gap-1 rounded-full px-2 text-[11px] font-medium"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <Clock className="h-3 w-3" />
          {startTime && endTime
            ? `${startTime} – ${endTime}`
            : "Vaqt belgilash"}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-64 space-y-3 p-3"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1.5">
          <Label htmlFor="deal-start" className="text-[11px]">
            Boshlanish vaqti
          </Label>
          <Input
            id="deal-start"
            type="time"
            value={start}
            onChange={handleStartChange}
            onKeyDown={handleInputKeyDown}
            className="h-8 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="deal-end" className="text-[11px]">
              Tugash vaqti
            </Label>
          </div>
          <Input
            id="deal-end"
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="h-8 text-xs"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {DURATIONS.map((d) => (
              <Badge
                key={d.value}
                variant="secondary"
                className="cursor-pointer bg-muted/50 text-[10px] hover:bg-primary hover:text-primary-foreground"
                onClick={() => setDuration(d.value)}
              >
                {d.label}
              </Badge>
            ))}
          </div>
        </div>

        {error && <p className="text-[11px] text-destructive">{error}</p>}

        <Button
          type="button"
          size="sm"
          className="h-8 w-full text-xs"
          onClick={handleSave}
        >
          Saqlash
        </Button>
      </PopoverContent>
    </Popover>
  )
}
