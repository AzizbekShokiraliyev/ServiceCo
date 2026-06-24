import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
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
import { useTasks } from "@/hooks/useTasks"
import InfoModal from "../InfoModel"
import { TasksProvider } from "./TaskProvide"
import type { Status } from "./TasksContext"

// 1. IMPORT TasksProvider alongside Status

const STATUS_LABELS: Record<Status, string> = {
  onWay: "Yo'lda",
  started: "Jarayonda",
  finished: "Tugagan",
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant="secondary" className="h-9 px-4 text-sm">
      {STATUS_LABELS[status]}
    </Badge>
  )
}

function getInitials(title: string) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

// 2. RENAME your main component to ClientInfoContent
function ClientInfoContent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTask, updateStatus, finishTask } = useTasks()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const task = getTask(Number(id))

  if (!task) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate("/workers")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Orqaga
        </Button>
        <p className="text-muted-foreground">
          Vazifa topilmadi yoki tugatilgan.
        </p>
      </div>
    )
  }

  function handleStatusChange(value: string) {
    if (!value) return
    if (value === "finished") {
      setConfirmOpen(true)
      return
    }
    updateStatus(task!.id, value as Status)
  }

  function handleConfirmFinish() {
    finishTask(task!.id)
    setConfirmOpen(false)
    navigate("/workers")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/workers")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Orqaga
        </Button>
        <InfoModal
          onSubmit={({ reason, duration }) => {
            console.log("Task report submitted:", {
              taskId: task.id,
              reason,
              duration,
            })
          }}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary/10 text-2xl font-bold">
                {getInitials(task.title)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-3xl">{task.title}</CardTitle>
              <CardDescription className="mt-2">
                Vazifa #{task.id}
              </CardDescription>
            </div>
            <StatusBadge status={task.status} />
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
          <CardTitle>Ish holati</CardTitle>
          <CardDescription>Joriy holatni yangilang</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <ToggleGroup
            type="single"
            value={task.status}
            onValueChange={handleStatusChange}
            className="grid grid-cols-1 gap-3 md:grid-cols-3"
          >
            <ToggleGroupItem value="onWay" className="h-12">
              <Car className="mr-2" /> Yo&apos;ldaman
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
              Bu amalni qaytarib bo&apos;lmaydi. &quot;{task.title}&quot;
              vazifasi bajarilganlar qatoriga o&apos;tkaziladi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmFinish}>
              Ha, tugatdim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function ClientInfo() {
  return (
    <TasksProvider>
      <ClientInfoContent />
    </TasksProvider>
  )
}
