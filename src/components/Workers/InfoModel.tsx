import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, SendHorizontal } from "lucide-react"

export default function InfoModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          Xabar <SendHorizontal className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Ish haqida ma'lumot</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="reason">Nima buzilgan? (Sabab)</Label>
            <Textarea
              id="reason"
              placeholder="Muammo tafsilotlarini yozing..."
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
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2 sm:justify-end">
            <DialogClose asChild>
              <Button variant="ghost">Bekor qilish</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Yuborish</Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
