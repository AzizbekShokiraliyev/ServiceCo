import { useState } from "react"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Skill } from "@/interface/Interface"

interface AddWorkerModalProps {
  onAdd: (name: string, skill: Skill) => void
}

const DEFAULT_SKILL: Skill = "Electrical"

export default function AddWorkerModal({ onAdd }: AddWorkerModalProps) {
  const [open, setOpen] = useState(false)
  const [fullName, setFullName] = useState("")
  const [skill, setSkill] = useState<Skill>(DEFAULT_SKILL)

  // Har safar modal qayta ochilganda formani tozalab boshlaymiz
  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) {
      setFullName("")
      setSkill(DEFAULT_SKILL)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = fullName.trim()
    if (!trimmedName) return

    onAdd(trimmedName, skill)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-1.5 h-4 w-4" />
          Ishchi qo'shish
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Yangi ishchi qo'shish</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="worker-name">Ism familiya</Label>
            <Input
              id="worker-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alisher Karimov"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label>Ish yo'nalishi</Label>
            <Select value={skill} onValueChange={(v) => setSkill(v as Skill)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Electrical">Elektrik</SelectItem>
                <SelectItem value="Plumbing">Santexnik</SelectItem>
                <SelectItem value="HVAC">Konditsioner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={!fullName.trim()}>
              Qo'shish
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
