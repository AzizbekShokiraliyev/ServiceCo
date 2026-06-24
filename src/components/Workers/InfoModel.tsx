import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, SendHorizontal } from "lucide-react"

export default function InfoModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          Xabar <SendHorizontal />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Ish haqida ma'lumot</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Nima buzilgan? (Sabab)</Label>
            <Textarea 
              placeholder="Muammo tafsilotlarini yozing..." 
            />
          </div>

          {/* Duration Field */}
          <div className="space-y-1.5">
            <Label>Taxminiy vaqt</Label>
            <div className="relative flex items-center">
              <Clock className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-9" 
                placeholder="Masalan: 2 soat" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button type="submit">
              Yuborish
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}