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
import { useJobById, useJobStatusUpdate } from "@/hooks/useJobs"
import type { JobStatus } from "@/interface/Interface"

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

const STATUS_LABELS: Record<string, string> = {
  on_way: "Yo'lda",
  in_progress: "Jarayonda",
  completed: "Tugagan",
}

export default function ClientInfo() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [confirmOpen, setConfirmOpen] = useState(false)

  // ✅ Supabase dan job ni olish
  const { data: job, isLoading } = useJobById(id)
  const { mutate: updateStatus } = useJobStatusUpdate()

  const handleStatusChange = (value: string) => {
    if (!value || !id) return
    if (value === "completed") {
      setConfirmOpen(true)
    } else {
      updateStatus({ id, status: value as JobStatus })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Yuklanmoqda...
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <p className="text-lg text-muted-foreground">Vazifa topilmadi.</p>
        <Button onClick={() => navigate(-1)}>Orqaga qaytish</Button>
      </div>
    )
  }

  const time =
    job.scheduled_start && job.scheduled_end
      ? `${job.scheduled_start} - ${job.scheduled_end}`
      : "Belgilanmagan"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Orqaga
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary/10 text-2xl font-bold">
                {job.client_name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle>
                <div className="text-3xl">{job.title}</div>
              </CardTitle>
              <CardDescription>
                <div className="mt-1">{job.client_name}</div>
                <div className="mt-1 text-xs">Vazifa #{job.id.slice(0, 8)}</div>
              </CardDescription>
            </div>
            <Badge variant="secondary" className="h-9 px-4 text-sm">
              {STATUS_LABELS[job.status] ?? job.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          icon={Phone}
          label="Telefon"
          value={job.client_phone ?? "Yo'q"}
        />
        <InfoCard icon={MapPin} label="Manzil" value={job.address ?? "Yo'q"} />
        <InfoCard icon={Clock} label="Vaqt" value={time} />
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
              value={job.status}
              onValueChange={handleStatusChange}
              className="grid grid-cols-1 gap-3 md:grid-cols-3"
            >
              <ToggleGroupItem value="on_way" className="h-12">
                <Car className="mr-2 h-4 w-4" /> Yo'ldaman
              </ToggleGroupItem>
              <ToggleGroupItem value="in_progress" className="h-12">
                <Cog className="mr-2 h-4 w-4" /> Boshladim
              </ToggleGroupItem>
              <ToggleGroupItem value="completed" className="h-12">
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
                updateStatus({ id: job.id, status: "completed" })
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
