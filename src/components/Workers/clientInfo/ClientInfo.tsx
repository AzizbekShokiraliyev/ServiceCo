"use client"

import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Phone, MapPin, Clock, Car, Cog, Check } from "lucide-react"
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
import { StatCard } from "@/components/shared/StatCard"

import { useQueryClient } from "@tanstack/react-query"
import { useJobById, useJobStatusUpdate } from "@/hooks/useJobs"
import type { Job, JobStatus } from "@/interface/Interface"

const STATUS_LABELS: Record<string, string> = {
  pending: "Kutilmoqda",
  on_way: "Yo'lda",
  in_progress: "Jarayonda",
  completed: "Tugagan",
}

export default function ClientInfo() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data: job, isLoading } = useJobById(id)
  const { mutate: updateStatus } = useJobStatusUpdate()

  const [isBusy, setIsBusy] = useState(false)

  const currentStatus = job?.status ?? ""
  const isCompleted = currentStatus === "completed"

  const submitStatus = (status: JobStatus, onDone?: () => void) => {
    if (!id) return

    let canProceed = false
    setIsBusy((prev) => {
      if (prev) return prev
      canProceed = true
      return true
    })
    if (!canProceed) return

    updateStatus(
      { id, status },
      {
        onSuccess: () => {
          queryClient.setQueryData<Job | undefined>(["job", id], (oldData) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              status: status,
            }
          })

          queryClient.setQueryData<Job[] | undefined>(["jobs"], (oldData) => {
            if (!oldData || !Array.isArray(oldData)) return oldData

            return oldData.map((item) =>
              item.id === id ? { ...item, status: status } : item
            )
          })

          toast.success("Holat yangilandi", {
            description: `Ish holati: ${STATUS_LABELS[status]}`,
            position: "top-center",
          })
          onDone?.()
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
        onSettled: () => setIsBusy(false),
      }
    )
  }

  const handleClickInstant = (
    e: React.MouseEvent<HTMLButtonElement>,
    value: string
  ) => {
    if (!value || value === currentStatus || value === "completed") return
    e.currentTarget.disabled = true
    submitStatus(value as JobStatus)
  }

  if (isLoading) return <LoadingSpinner />

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
                <div className="mt-1 text-xs">Vazifa #{shortId}</div>
              </CardDescription>
            </div>
            <Badge variant="secondary" className="h-9 px-4 text-sm">
              {STATUS_LABELS[currentStatus] ?? currentStatus}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Phone}
          title="Telefon"
          value={job.client_phone ?? "Yo'q"}
          iconColor="text-emerald-500"
          valueColor="text-xl font-semibold tracking-normal"
        />
        <StatCard
          icon={MapPin}
          title="Manzil"
          value={job.address ?? "Yo'q"}
          iconColor="text-blue-500"
          valueColor="text-xl font-semibold tracking-normal truncate"
        />
        <StatCard
          icon={Clock}
          title="Vaqt"
          value={time}
          iconColor="text-amber-500"
          valueColor="text-xl font-semibold tracking-normal"
        />
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
              value={currentStatus}
              disabled={isBusy}
              className="grid grid-cols-1 gap-3 md:grid-cols-3"
            >
              <ToggleGroupItem
                value="on_way"
                className="h-12 data-[state=on]:border-blue-500/50 data-[state=on]:bg-blue-500/10 data-[state=on]:text-blue-500"
                disabled={currentStatus === "on_way" || isCompleted || isBusy}
                onClick={(e) => handleClickInstant(e, "on_way")}
              >
                <Car className="mr-2 h-4 w-4" />
                Yo'ldaman
              </ToggleGroupItem>

              <ToggleGroupItem
                value="in_progress"
                className="h-12 data-[state=on]:border-amber-500/50 data-[state=on]:bg-amber-500/10 data-[state=on]:text-amber-500"
                disabled={
                  currentStatus === "in_progress" || isCompleted || isBusy
                }
                onClick={(e) => handleClickInstant(e, "in_progress")}
              >
                <Cog className="mr-2 h-4 w-4" />
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
                  isLoading={isBusy}
                  trigger={
                    <ToggleGroupItem
                      value="completed"
                      disabled={isBusy}
                      className="h-12 data-[state=on]:bg-transparent"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Tugatdim
                    </ToggleGroupItem>
                  }
                  onConfirm={() =>
                    submitStatus("completed" as JobStatus, () => navigate(-1))
                  }
                />
              )}
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
