import { useState } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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

function validateTimes(start: string, end: string): string {
  if (!start || !end) return "Boshlanish va tugash vaqtini kiriting"
  if (start >= end) return "Tugash vaqti boshlanishidan keyin bo'lishi kerak"
  return ""
}

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

  const handleSave = () => {
    const err = validateTimes(start, end)
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
        className="w-52 space-y-3 p-3"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1.5">
          <Label className="text-[11px]">Boshlanish vaqti</Label>
          <Input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
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
