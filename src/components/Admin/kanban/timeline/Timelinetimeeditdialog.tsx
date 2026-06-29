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
import type { TimelineEvent, TimelineRow } from "@/interface/Interface"

// ─── Props ────────────────────────────────────────────────────────────────────

interface TimelineTimeEditDialogProps {
  event: TimelineEvent
  rows: TimelineRow[]
  onSave: (startTime: string, endTime: string) => void
  onRowChange?: (newRowId: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TimelineTimeEditDialog = ({
  event,
  rows,
  onSave,
  onRowChange,
}: TimelineTimeEditDialogProps) => {
  const [open, setOpen] = useState(false)
  const [start, setStart] = useState(event.startTime)
  const [end, setEnd] = useState(event.endTime)
  const [selectedRowId, setSelectedRowId] = useState(event.rowId)
  const [error, setError] = useState("")

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) {
      setStart(event.startTime)
      setEnd(event.endTime)
      setSelectedRowId(event.rowId)
      setError("")
    }
  }

  const handleSave = () => {
    if (!start || !end) {
      setError("Boshlanish va tugash vaqtini kiriting")
      return
    }
    if (start >= end) {
      setError("Tugash vaqti boshlanishidan keyin bo'lishi kerak")
      return
    }
    setError("")
    onSave(start, end)
    if (onRowChange && selectedRowId !== event.rowId) {
      onRowChange(selectedRowId)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto flex w-fit items-center gap-0.5 text-[10px] text-muted-foreground transition-colors select-none hover:text-foreground hover:underline"
        >
          <Clock className="h-2.5 w-2.5" />
          {event.startTime} – {event.endTime}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-56 space-y-3 p-3 text-xs"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <Label htmlFor="tl-start" className="text-[10px]">
            Boshlanish vaqti
          </Label>
          <Input
            id="tl-start"
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="h-8 text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="tl-end" className="text-[10px]">
            Tugash vaqti
          </Label>
          <Input
            id="tl-end"
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="h-8 text-xs"
          />
        </div>

        {onRowChange && rows.length > 0 && (
          <div className="space-y-1">
            <Label className="text-[10px]">Ishchi</Label>
            <Select value={selectedRowId} onValueChange={setSelectedRowId}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Ishchini tanlang" />
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

        {error && <p className="text-[10px] text-destructive">{error}</p>}

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
