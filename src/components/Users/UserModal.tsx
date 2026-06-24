import { useState } from "react"
import { useNavigate } from "react-router-dom"

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

const UserModal = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [problem, setProblem] = useState("")

  const handleSubmit = () => {
    // TODO: backendga yuborish (fetch/axios)

    setOpen(false)
    navigate("/profile", {
      state: { fullName, email, location, problem },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Muammo bor</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Muammoni yuborish</DialogTitle>
          <DialogDescription>
            Ma'lumotlaringizni to'ldiring, tez orada siz bilan bog'lanamiz.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">To'liq ism</Label>
            <Input
              id="fullName"
              placeholder="Ism Familiya"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
              placeholder="Shahar, tuman"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem">Muammo</Label>
            <Textarea
              id="problem"
              placeholder="Muammoni batafsil yozing..."
              className="min-h-[100px] resize-none"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Bekor qilish
          </Button>
          <Button onClick={handleSubmit}>Yuborish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UserModal
