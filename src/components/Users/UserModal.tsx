import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function UserModal() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [problem, setProblem] = useState("")

  const handleSubmit = () => {
    setOpen(false)
    navigate("/profile", {
      state: { fullName, email, location, problem },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Yangi muammo
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Muammoni yuborish</DialogTitle>
          <DialogDescription>
            Ma'lumotlaringizni to'ldiring. Biz tez orada siz bilan bog'lanamiz.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">To'liq ism</Label>
            <Input
              id="fullName"
              placeholder="Masalan: Aleks Mirzayev"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Elektron pochta</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Manzil</Label>
            <Input
              id="location"
              placeholder="Masalan: Toshkent, Yunusobod"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem">Muammo tafsiloti</Label>
            <Textarea
              id="problem"
              placeholder="Muammoni batafsil yozib qoldiring..."
              className="min-h-[120px] resize-none"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Bekor qilish
          </Button>
          <Button onClick={handleSubmit}>Yuborish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
