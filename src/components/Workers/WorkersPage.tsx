import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  LayoutList,
  CalendarDays,
  Briefcase,
  CheckCircle,
  ThermometerSun,
} from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

import WorkersHeader from "./WorkersHeader"
import { ReportSickDialog } from "./ReportSickDialog"
import { ListContainer } from "@/components/shared/ListContainer"
import { InfoListItem } from "@/components/shared/InfoListItem"
import { StatCard } from "@/components/shared/StatCard"
import {
  Timeline,
  type TimelineRow,
  type TimelineEvent,
} from "@/components/Admin/kanban/timeline/Timeline"

import { useProfile } from "@/hooks/useProfile"
import { useJobsByTechnician } from "@/hooks/useJobs"
import { useTechnicians } from "@/hooks/useTechnicians"
import { JOB_TYPE_CONFIG } from "@/lib/jobStyles"
import { useSickReportsByTechnician } from "@/hooks/Usesickreports"
import {
  extractHHMM,
  isValidHHMM,
} from "../Admin/kanban/timeline/utils/timelineUtils"

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

  const { data: sickReports = [] } = useSickReportsByTechnician(
    myTechnician?.id
  )
  const latestReport = sickReports[0]
  const isSickToday =
    latestReport &&
    new Date(latestReport.created_at).toDateString() ===
      new Date().toDateString()

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

  const workerEvents: TimelineEvent[] = myTechnician
    ? remainingJobs
        .filter((j) => j.scheduled_start && j.scheduled_end)
        .map((j) => ({
          id: j.id,
          rowId: myTechnician.id,
          title: j.title,
          subtitle: j.address ?? "",
          startTime: extractHHMM(j.scheduled_start) ?? "",
          endTime: extractHHMM(j.scheduled_end) ?? "",
        }))
        .filter((e) => isValidHHMM(e.startTime) && isValidHHMM(e.endTime))
    : []

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <WorkersHeader
            name={myTechnician?.full_name ?? profile?.full_name ?? "Ishchi"}
            role={myTechnician?.skill ?? "Texnik"}
          />
        </div>
        <ReportSickDialog technicianId={myTechnician?.id} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard
          title="Bugungi ishlar"
          value={remainingJobs.length}
          subtext={new Date().toLocaleDateString("uz-UZ", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          icon={Briefcase}
        />

        <StatCard
          title="Bajarilganlar"
          value={completedJobs.length}
          subtext={`${remainingJobs.length} ta bajariladigan ish qoldi`}
          icon={CheckCircle}
          iconColor="text-emerald-500"
          valueColor="text-emerald-500"
        />
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
        {isSickToday && (
          <Badge className="gap-1 bg-amber-500/10 text-amber-600 hover:bg-amber-500/10">
            <ThermometerSun className="h-3 w-3" />
            Kasal
          </Badge>
        )}
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
        ) : !myTechnician ? (
          <div className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">
            Texnik profili topilmadi, timeline ko'rsatib bo'lmaydi.
          </div>
        ) : workerEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">
            Vazifalarda belgilangan vaqt yo'q, timeline bo'sh.
          </div>
        ) : (
          <div className="pt-2">
            <Timeline
              rows={workerRow}
              events={workerEvents}
              height="h-[140px]"
              readOnly
              hideNameColumn
            />
          </div>
        )}
      </ListContainer>
    </main>
  )
}
