"use client"

import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Phone, MapPin, Clock, Car, Cog, Check } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { toast } from "sonner"

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
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"

import { useQueryClient } from "@tanstack/react-query"
import { useJobById, useJobStatusUpdate } from "@/hooks/useJobs"
import type { JobStatus } from "@/interface/Interface"

const STATUS_LABELS: Record<string, string> = {
  pending: "Kutilmoqda",
  on_way: "Yo'lda",
  in_progress: "Jarayonda",
  completed: "Tugagan",
}

// InfoCard endi rangli ikonka bilan — vizual jihatdan ajralib turadi
function InfoCard({
  icon: Icon,
  label,
  value,
  colorClass,
}: {
  icon: LucideIcon
  label: string
  value: string
  colorClass: string
}) {
  return (
    <Card>
      <CardContent className="p-5 transition-all hover:shadow-md">
        <div
          className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ${colorClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 truncate text-lg font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}

export default function ClientInfo() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data: job, isLoading } = useJobById(id)
  const { mutate: updateStatus, isPending } = useJobStatusUpdate()

  // Status o'zgarganda umumiy xabarnoma va cache yangilash logikasi.
  // Toast tugma bosilgan zahoti chiqadi (chaqiruvchi joyda), bu yerda faqat
  // cache invalidate va xato qayta ishlanadi.
  const runStatusUpdate = (
    status: JobStatus,
    options?: { onSuccessExtra?: () => void }
  ) => {
    if (!id) return

    updateStatus(
      { id, status },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["job", id] })
          queryClient.invalidateQueries({ queryKey: ["jobs"] })
          options?.onSuccessExtra?.()
        },
        onError: (error) => {
          toast.error("Xatolik yuz berdi", {
            description:
              error instanceof Error
                ? error.message
                : "Holatni yangilab bo'lmadi. Qaytadan urinib ko'ring.",
            position: "top-center",
          })
        },
      }
    )
  }

  const handleStatusChange = (value: string) => {
    if (!value) return
    // "completed" alohida ConfirmDialog orqali boshqariladi, shu yerda e'tiborsiz qoldiriladi
    if (value === "completed") return

    // Toast bosilgan zahoti chiqadi, API javobini kutmaydi
    toast.success("Holat yangilandi", {
      description: `Ish holati: ${STATUS_LABELS[value]}`,
      position: "top-center",
    })

    runStatusUpdate(value as JobStatus)
  }

  if (isLoading) {
    return <LoadingSpinner />
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

  const shortId = job.id ? job.id.slice(0, 8) : "—"
  const isCompleted = job.status === "completed"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Orqaga
        </Button>
      </div>

      {/* Mijoz kartochkasi */}
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
                <div className="mt-1 text-xs">Vazifa #{shortId}</div>
              </CardDescription>
            </div>
            <Badge variant="secondary" className="h-9 px-4 text-sm">
              {STATUS_LABELS[job.status] ?? job.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Ma'lumotlar paneli */}
      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          icon={Phone}
          label="Telefon"
          value={job.client_phone ?? "Yo'q"}
          colorClass="bg-emerald-500/10 text-emerald-500"
        />
        <InfoCard
          icon={MapPin}
          label="Manzil"
          value={job.address ?? "Yo'q"}
          colorClass="bg-blue-500/10 text-blue-500"
        />
        <InfoCard
          icon={Clock}
          label="Vaqt"
          value={time}
          colorClass="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Ish holatini boshqarish paneli */}
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
              disabled={isPending}
              className="grid grid-cols-1 gap-3 md:grid-cols-3"
            >
              <ToggleGroupItem
                value="on_way"
                className="h-12 data-[state=on]:border-blue-500/50 data-[state=on]:bg-blue-500/10 data-[state=on]:text-blue-500"
                disabled={isCompleted}
              >
                <Car className="mr-2 h-4 w-4" />
                Yo'ldaman
              </ToggleGroupItem>

              <ToggleGroupItem
                value="in_progress"
                className="h-12 data-[state=on]:border-amber-500/50 data-[state=on]:bg-amber-500/10 data-[state=on]:text-amber-500"
                disabled={isCompleted}
              >
                <Cog
                  className={`mr-2 h-4 w-4 ${
                    job.status === "in_progress" ? "animate-spin" : ""
                  }`}
                />
                Boshladim
              </ToggleGroupItem>

              {isCompleted ? (
                <ToggleGroupItem
                  value="completed"
                  className="h-12 border-emerald-500/50 bg-emerald-500/10 text-emerald-500"
                  disabled
                >
                  <Check className="mr-2 h-4 w-4" /> Tugatilgan
                </ToggleGroupItem>
              ) : (
                <ConfirmDialog
                  variant="default"
                  title="Ishni tugatishni tasdiqlaysizmi?"
                  description="Bu amalni qaytarib bo'lmaydi. Vazifa bajarilganlar qatoriga o'tkaziladi."
                  confirmLabel="Ha, tugatdim"
                  cancelLabel="Bekor qilish"
                  trigger={
                    <ToggleGroupItem
                      value="completed"
                      disabled={isPending}
                      className="h-12 data-[state=on]:bg-transparent"
                    >
                      <Check className="mr-2 h-4 w-4" /> Tugatdim
                    </ToggleGroupItem>
                  }
                  onConfirm={() => {
                    toast.success("Ish yakunlandi!", {
                      description: "Vazifa bajarilganlar qatoriga qo'shildi.",
                      position: "top-center",
                    })
                    runStatusUpdate("completed" as JobStatus, {
                      onSuccessExtra: () => navigate(-1),
                    })
                  }}
                />
              )}
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
