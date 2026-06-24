import { useState } from "react"
import { ArrowLeft, Phone, MapPin, Clock, Car, Cog, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
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
import { InfoCard } from "./InfoCard"
import InfoModal from "../InfoModel"

const UI_TASK = {
  id: 1,
  title: "Ofis simlarini ta'mirlash",
  address: "42 Amir Temur",
  phone: "+998 90 123 45 67",
  time: "8:00 - 10:00",
}

export default function ClientInfo() {
  const [status, setStatus] = useState("started")
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleStatusChange = (value: string) => {
    if (!value) return
    if (value === "finished") {
      setConfirmOpen(true)
    } else {
      setStatus(value)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Orqaga
        </Button>
        <InfoModal />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary/10 text-2xl font-bold">
                OS
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-3xl">{UI_TASK.title}</CardTitle>
              <CardDescription className="mt-2">
                Vazifa #{UI_TASK.id}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="h-9 px-4 text-sm">
              {status === "onWay"
                ? "Yo'lda"
                : status === "started"
                  ? "Jarayonda"
                  : "Tugagan"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard icon={Phone} label="Telefon" value={UI_TASK.phone} />
        <InfoCard icon={MapPin} label="Manzil" value={UI_TASK.address} />
        <InfoCard icon={Clock} label="Vaqt" value={UI_TASK.time} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ish holati</CardTitle>
          <CardDescription>Joriy holatni yangilang</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <ToggleGroup
            type="single"
            value={status}
            onValueChange={handleStatusChange}
            className="grid grid-cols-1 gap-3 md:grid-cols-3"
          >
            <ToggleGroupItem value="onWay" className="h-12">
              <Car className="mr-2" /> Yo'ldaman
            </ToggleGroupItem>
            <ToggleGroupItem value="started" className="h-12">
              <Cog className="mr-2" /> Boshladim
            </ToggleGroupItem>
            <ToggleGroupItem value="finished" className="h-12">
              <Check className="mr-2" /> Tugatdim
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Ishni tugatishni tasdiqlaysizmi?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bu amalni qaytarib bo'lmaydi. Vazifa bajarilganlar qatoriga
              o'tkaziladi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={() => setConfirmOpen(false)}>
              Ha, tugatdim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
