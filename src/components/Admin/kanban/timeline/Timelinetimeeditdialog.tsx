import { useState } from "react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TimelineTimeEditDialogProps } from "@/interface/Interface"
import {
  validateTimeRange,
  timeToMinutes,
  minutesToTime,
} from "./utils/timelineUtils"

const DURATIONS = [
  { label: "30 daq", value: 30 },
  { label: "1 st", value: 60 },
  { label: "1.5 st", value: 90 },
  { label: "2 st", value: 120 },
]

export const TimelineTimeEditDialog = ({
  event,
  rows,
  onSave,
  onRowChange,
}: TimelineTimeEditDialogProps) => {
  const [open, setOpen] = useState(false)
  const [start, setStart] = useState(event.startTime)
  const [end, setEnd] = useState(event.endTime)
  const [rowId, setRowId] = useState(event.rowId)
  const [error, setError] = useState("")

  const handleOpen = (next: boolean) => {
    setOpen(next)
    if (next) {
      setStart(event.startTime)
      setEnd(event.endTime)
      setRowId(event.rowId)
      setError("")
    }
  }

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value
    if (start && end && newStart) {
      const diff = timeToMinutes(end) - timeToMinutes(start)
      if (diff > 0) setEnd(minutesToTime(timeToMinutes(newStart) + diff))
    }
    setStart(newStart)
  }

  const handleSave = () => {
    const err = validateTimeRange(start, end)
    if (err) {
      setError(err)
      return
    }
    onSave(start, end)
    if (onRowChange && rowId !== event.rowId) onRowChange(rowId)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto flex w-fit items-center gap-1 text-[10px] text-muted-foreground transition-colors select-none hover:text-foreground"
        >
          <Clock className="h-2.5 w-2.5" />
          {event.startTime} – {event.endTime}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[220px] space-y-3 p-3"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1.5">
          <Label className="text-[11px]">Boshlanish vaqti</Label>
          <Input
            type="time"
            value={start}
            onChange={handleStartChange}
            className="h-8 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px]">Tugash vaqti</Label>
          <Input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="h-8 text-xs"
          />
          <div className="flex flex-wrap gap-1 pt-1">
            {DURATIONS.map((d) => (
              <Badge
                key={d.value}
                variant="outline"
                className="cursor-pointer text-[9px] hover:bg-primary hover:text-primary-foreground"
                onClick={() =>
                  setEnd(minutesToTime(timeToMinutes(start) + d.value))
                }
              >
                {d.label}
              </Badge>
            ))}
          </div>
        </div>

        {onRowChange && rows.length > 0 && (
          <div className="space-y-1.5">
            <Label className="text-[11px]">Ishchi</Label>
            <Select value={rowId} onValueChange={setRowId}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Tanlang" />
              </SelectTrigger>
              <SelectContent>
                {rows.map((row) => (
                  <SelectItem key={row.id} value={row.id} className="text-xs">
                    {row.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
