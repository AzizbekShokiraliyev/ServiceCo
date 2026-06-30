"use client"

import { AlertCircle, MapPin, Clock, User as UserIcon } from "lucide-react"
import UserModal from "./UserModal"
import { useJobs } from "@/hooks/useJobs"
import { useProfile } from "@/hooks/useProfile"
import { JOB_STATUS_CONFIG, JOB_TYPE_CONFIG } from "@/lib/jobStyles"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function User() {
  const { data: profile } = useProfile()
  const { data: jobs = [], isLoading } = useJobs()

  const myJobs = jobs.filter((j) => j.created_by === profile?.id)
  const openJobs = myJobs.filter((j) => j.status !== "completed")

  return (
    <div className="flex h-full flex-col space-y-6 p-1">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Mening buyurtmalarim
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Yuborilgan muammolaringiz va ularning holati
          </p>
        </div>
        <UserModal />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Faol murojaatlar</CardTitle>
            <CardDescription>
              Sizning yuborgan ochiq so'rovlaringiz
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[calc(100vh-280px)] px-6 pb-6">
              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl border p-4"
                    >
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-3 w-[150px]" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-[80px] rounded-full" />
                    </div>
                  ))
                ) : openJobs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground/60" />
                    <p className="mt-4 text-sm font-medium text-muted-foreground">
                      Hozircha ochiq buyurtmalar yo'q.
                    </p>
                  </div>
                ) : (
                  openJobs.map((job) => {
                    const category =
                      JOB_TYPE_CONFIG[job.job_type ?? "electrical"]
                    const status = JOB_STATUS_CONFIG[job.status]
                    const IconComponent = category?.icon || AlertCircle

                    return (
                      <div
                        key={job.id}
                        className="group flex flex-col justify-between gap-4 rounded-xl border bg-card p-4 transition-all hover:bg-accent/20 sm:flex-row sm:items-center"
                      >
                        {/* CHAP TOMON: Ikonka, Sarlavha va Manzil */}
                        <div className="flex items-start gap-4 sm:items-center">
                          <div
                            className={`rounded-xl p-2.5 ${category?.bg || "bg-muted"}`}
                          >
                            <IconComponent
                              className={`h-5 w-5 ${category?.text || "text-foreground"}`}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <h4 className="text-base leading-none font-semibold tracking-tight transition-colors group-hover:text-primary">
                              {job.title}
                            </h4>
                            {job.address && (
                              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                <span className="max-w-[200px] truncate sm:max-w-[300px]">
                                  {job.address}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* O'NG TOMON: Usta/Vaqt (Kapsula dizayni) + Status Badge */}
                        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                          {(job.technician?.full_name ||
                            job.scheduled_start) && (
                            <div className="flex items-center gap-2.5 rounded-lg border bg-muted/40 px-3 py-1.5 text-xs shadow-sm">
                              {/* Usta ismi */}
                              {job.technician?.full_name && (
                                <div className="flex items-center gap-1.5">
                                  <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="font-medium text-foreground/80">
                                    {job.technician.full_name}
                                  </span>
                                </div>
                              )}

                              {/* O'rtadagi chiziqcha (Ajratgich) */}
                              {job.technician?.full_name &&
                                job.scheduled_start && (
                                  <div className="h-3.5 w-px bg-border/80" />
                                )}

                              {/* Vaqt */}
                              {job.scheduled_start && job.scheduled_end && (
                                <div className="flex items-center gap-1.5 text-primary">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span className="font-bold tracking-wide">
                                    {job.scheduled_start} - {job.scheduled_end}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Holat Badge */}
                          <Badge
                            variant="secondary"
                            className={`rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase shadow-none ${status?.className || ""}`}
                          >
                            {status?.label || job.status}
                          </Badge>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
