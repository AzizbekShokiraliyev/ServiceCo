import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { timeToMinutes, minutesToTime } from "./timeline/utils/timelineUtils"
import { useDragAssignContext } from "../context/DragAssignContext"

const DURATIONS = [
  { label: "30 daq", value: 30 },
  { label: "1 soat", value: 60 },
  { label: "1.5 soat", value: 90 },
  { label: "2 soat", value: 120 },
  { label: "3 soat", value: 180 },
]

export function AssignTimeModal() {
  const {
    pendingAssign,
    pendingStart,
    pendingEnd,
    pendingError,
    setPendingStart,
    setPendingEnd,
    cancelPendingAssign,
    confirmPendingAssign,
  } = useDragAssignContext()

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value
    if (pendingStart && pendingEnd && newStart) {
      const diff = timeToMinutes(pendingEnd) - timeToMinutes(pendingStart)
      if (diff > 0) setPendingEnd(minutesToTime(timeToMinutes(newStart) + diff))
    } else if (newStart && !pendingEnd) {
      setPendingEnd(minutesToTime(timeToMinutes(newStart) + 60)) // Default 1 soat
    }
    setPendingStart(newStart)
  }

  const setDuration = (mins: number) => {
    if (!pendingStart) return
    setPendingEnd(minutesToTime(timeToMinutes(pendingStart) + mins))
  }

  return (
    <AlertDialog
      open={!!pendingAssign}
      onOpenChange={(open) => !open && cancelPendingAssign()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {pendingAssign?.technicianName}ga tayinlash
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ishni tayinlashdan oldin ish vaqtini belgilang.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="pending-start">Boshlanish vaqti</Label>
            <Input
              id="pending-start"
              type="time"
              value={pendingStart}
              onChange={handleStartChange}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pending-end">Tugash vaqti</Label>
            <Input
              id="pending-end"
              type="time"
              value={pendingEnd}
              onChange={(e) => setPendingEnd(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 pt-2">
              {DURATIONS.map((d) => (
                <Badge
                  key={d.value}
                  variant="secondary"
                  className="cursor-pointer bg-muted px-3 py-1 hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setDuration(d.value)}
                >
                  {d.label}
                </Badge>
              ))}
            </div>
          </div>
          {pendingError && (
            <p className="text-xs font-medium text-destructive">
              {pendingError}
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelPendingAssign}>
            Bekor qilish
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              confirmPendingAssign()
            }}
          >
            Tayinlash
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
