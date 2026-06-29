import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutList, CalendarDays, Briefcase, CheckCircle } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import WorkersHeader from "./WorkersHeader"
import { ListContainer } from "@/components/shared/ListContainer"
import { InfoListItem } from "@/components/shared/InfoListItem"
import {
  Timeline,
  type TimelineRow,
  type TimelineEvent,
} from "@/components/Admin/kanban/timeline/Timeline"

import { useProfile } from "@/hooks/useProfile"
import { useJobsByTechnician } from "@/hooks/useJobs"
import { useTechnicians } from "@/hooks/useTechnicians"
import { JOB_TYPE_CONFIG } from "@/lib/jobStyles"

type ViewMode = "list" | "timeline"

export default function WorkersPage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: techniciansData = [] } = useTechnicians()

  const myTechnician = techniciansData.find((t) => t.profile_id === profile?.id)

  const { data: jobGroups, isLoading: jobsLoading } = useJobsByTechnician(
    myTechnician?.id
  )
  const completedJobs = jobGroups?.completed ?? []
  const remainingJobs = jobGroups?.remaining ?? []

  const workerRow: TimelineRow[] = myTechnician
    ? [
        {
          id: myTechnician.id,
          label: myTechnician.full_name,
          sublabel: myTechnician.skill,
          avatarChar: myTechnician.full_name[0],
        },
      ]
    : []

  const workerEvents: TimelineEvent[] = remainingJobs
    .filter((j) => j.scheduled_start && j.scheduled_end)
    .map((j) => ({
      id: j.id,
      rowId: myTechnician?.id ?? "",
      title: j.title,
      subtitle: j.address ?? "",
      startTime: j.scheduled_start!,
      endTime: j.scheduled_end!,
    }))

  if (profileLoading || jobsLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[240px]" />
          <Skeleton className="h-4 w-[140px]" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>

        <div className="space-y-4 rounded-xl border border-border/50 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[180px]" />
              <Skeleton className="h-4 w-[280px]" />
            </div>
            <Skeleton className="h-9 w-[160px] rounded-lg" />
          </div>
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <main className="space-y-6">
      <WorkersHeader
        name={myTechnician?.full_name ?? profile?.full_name ?? "Ishchi"}
        role={myTechnician?.skill ?? "Texnik"}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Bugungi ishlar kartasi */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bugungi ishlar
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {remainingJobs.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date().toLocaleDateString("uz-UZ", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </CardContent>
        </Card>

        {/* Bajarilgan ishlar kartasi */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bajarilganlar
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-emerald-500">
              {completedJobs.length}
            </div>
            <p className="mt-1 text-xs font-medium text-emerald-500">
              {remainingJobs.length} ta bajariladigan ish qoldi
            </p>
          </CardContent>
        </Card>
      </div>

      <ListContainer
        title="Bugungi jadval"
        description="Sizga tayinlangan faol ishlar"
        headerAction={
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
          >
            <TabsList>
              <TabsTrigger value="list" className="gap-1.5">
                <LayoutList className="h-4 w-4" /> Ro'yxat
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-1.5">
                <CalendarDays className="h-4 w-4" /> Timeline
              </TabsTrigger>
            </TabsList>
          </Tabs>
        }
      >
        {remainingJobs.length === 0 ? (
          <div className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">
            Barcha ishlar bajarilgan yoki tayinlangan ish yo'q.
          </div>
        ) : viewMode === "list" ? (
          remainingJobs.map((job) => {
            const config = JOB_TYPE_CONFIG[job.job_type ?? "electrical"] || {
              icon: Briefcase,
              bg: "bg-muted",
              text: "text-foreground",
            }
            const time =
              job.scheduled_start && job.scheduled_end
                ? `${job.scheduled_start} - ${job.scheduled_end}`
                : undefined

            return (
              <InfoListItem
                key={job.id}
                icon={config.icon}
                iconBg={config.bg}
                iconColor={config.text}
                title={job.title}
                duration={time}
                onClick={() => navigate(`/workers/client/${job.id}`)}
              />
            )
          })
        ) : (
          <div className="pt-2">
            <Timeline
              rows={workerRow}
              events={workerEvents}
              height="h-[140px]"
              readOnly
            />
          </div>
        )}
      </ListContainer>
    </main>
  )
}
