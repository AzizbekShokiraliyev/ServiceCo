import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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

import { useKanban } from "./context/KanbanContext"

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
  } = useKanban()

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

        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="pending-start">Boshlanish vaqti</Label>
            <Input
              id="pending-start"
              type="time"
              value={pendingStart}
              onChange={(e) => setPendingStart(e.target.value)}
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
          </div>
          {pendingError && (
            <p className="text-xs text-destructive">{pendingError}</p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelPendingAssign}>
            Bekor qilish
          </AlertDialogCancel>
          <AlertDialogAction onClick={confirmPendingAssign}>
            Tayinlash
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
