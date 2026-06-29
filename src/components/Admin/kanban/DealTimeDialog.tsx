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

interface DealTimeDialogProps {
  startTime?: string
  endTime?: string
  onSave: (startTime: string, endTime: string) => void
}

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
    setOpen(false)
  }

  // ✅ Input keydown — Enter saqlaydi, drag listener'ga yetmaydi
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation() // drag bloklash
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
        className="w-64 space-y-3"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1.5">
          <Label htmlFor="deal-start">Boshlanish vaqti</Label>
          <Input
            id="deal-start"
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            onKeyDown={handleInputKeyDown} // ✅
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="deal-end">Tugash vaqti</Label>
          <Input
            id="deal-end"
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            onKeyDown={handleInputKeyDown} // ✅
          />
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <Button type="button" size="sm" className="w-full" onClick={handleSave}>
          Saqlash
        </Button>
      </PopoverContent>
    </Popover>
  )
}
