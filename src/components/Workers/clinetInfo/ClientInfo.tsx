import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Phone, MapPin, Clock, Car, Cog, Check } from "lucide-react"
import type { LucideIcon } from "lucide-react"

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

const TASKS_DATA = {
  t1: {
    id: "t1",
    title: "Ofis simlarini ta'mirlash",
    address: "5-bino, 3-qavat (Amir Temur ko'chasi)",
    phone: "+998 90 123 45 67",
    time: "08:00 - 10:00",
  },
  t2: {
    id: "t2",
    title: "Quvur sizishi",
    address: "Chilonzor dahasi, 12-uy",
    phone: "+998 93 987 65 43",
    time: "10:30 - 12:00",
  },
  t3: {
    id: "t3",
    title: "Eshik o'rnatish",
    address: "Yunusobod tumani, 4-kvartal",
    phone: "+998 94 333 22 11",
    time: "13:00 - 15:00",
  },
}

// Internal reusable component for the info boxes
function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <Card>
      <CardContent className="p-5 transition-all hover:shadow-md">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 text-lg font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}

export default function ClientInfo() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [status, setStatus] = useState("started")
  const [confirmOpen, setConfirmOpen] = useState(false)

  const task = id && id in TASKS_DATA ? TASKS_DATA[id as keyof typeof TASKS_DATA] : null

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-muted-foreground text-lg">Vazifa topilmadi.</p>
        <Button onClick={() => navigate(-1)}>Orqaga qaytish</Button>
      </div>
    )
  }

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
        <Button variant="outline" onClick={() => navigate(-1)}>
          {/* navigate(-1) makes the back button work instantly! */}
          <ArrowLeft className="mr-2 h-4 w-4" /> Orqaga
        </Button>
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
              <CardTitle>
                <div className="text-3xl">{task.title}</div>
              </CardTitle>
              <CardDescription>
                <div className="mt-2">Vazifa #{task.id}</div>
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
        <InfoCard icon={Phone} label="Telefon" value={task.phone} />
        <InfoCard icon={MapPin} label="Manzil" value={task.address} />
        <InfoCard icon={Clock} label="Vaqt" value={task.time} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle>Ish holati</CardTitle>
            <CardDescription>Joriy holatni yangilang</CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="pt-6">
            <ToggleGroup
              type="single"
              value={status}
              onValueChange={handleStatusChange}
              className="grid grid-cols-1 gap-3 md:grid-cols-3"
            >
              <ToggleGroupItem value="onWay" className="h-12">
                <Car className="mr-2 h-4 w-4" /> Yo'ldaman
              </ToggleGroupItem>
              <ToggleGroupItem value="started" className="h-12">
                <Cog className="mr-2 h-4 w-4" /> Boshladim
              </ToggleGroupItem>
              <ToggleGroupItem value="finished" className="h-12">
                <Check className="mr-2 h-4 w-4" /> Tugatdim
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
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
            <AlertDialogAction
              onClick={() => {
                setStatus("finished")
                setConfirmOpen(false)
              }}
            >
              Ha, tugatdim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

