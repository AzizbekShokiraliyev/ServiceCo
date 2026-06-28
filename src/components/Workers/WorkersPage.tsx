import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Zap,
  Droplets,
  Wrench,
  LayoutList,
  CalendarDays,
  Briefcase,
  CheckCircle,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorkersHeader from "./WorkersHeader"
import { StatCard } from "@/components/shared/StatCard"
import { ListContainer } from "@/components/shared/ListContainer"
import { InfoListItem } from "@/components/shared/InfoListItem"
import {
  Timeline,
  type TimelineRow,
  type TimelineEvent,
} from "@/components/shared/timeLine/Timeline"
import { useProfile } from "@/hooks/useProfile"
import { useJobsByTechnician } from "@/hooks/useJobs"
import { useTechnicians } from "@/hooks/useTechnicians"
import type { JobType } from "@/interface/Interface"

type ViewMode = "list" | "timeline"

const JOB_TYPE_CONFIG: Record<
  JobType,
  { icon: React.ElementType; iconColor: string; iconBg: string }
> = {
  electrical: {
    icon: Zap,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  plumbing: {
    icon: Droplets,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  hvac: {
    icon: Wrench,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
}

export default function WorkersPage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  // ✅ Login bo'lgan userning profili
  const { data: profile, isLoading: profileLoading } = useProfile()

  // ✅ Profilga tegishli texnikni topish
  const { data: techniciansData = [] } = useTechnicians()
  const myTechnician = techniciansData.find((t) => t.profile_id === profile?.id)

  // ✅ Texnikning ishlari
  const { data: jobs = [], isLoading: jobsLoading } = useJobsByTechnician(
    myTechnician?.id
  )

  const completedJobs = jobs.filter((j) => j.status === "completed")
  const remainingJobs = jobs.filter((j) => j.status !== "completed")

  // Timeline uchun
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

  const workerEvents: TimelineEvent[] = jobs
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
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Yuklanmoqda...
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
        <StatCard
          title="Bugungi ishlar"
          value={jobs.length}
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
          subtext={`${remainingJobs.length} ta qoldi`}
          icon={CheckCircle}
          valueColor="text-emerald-500"
          iconColor="text-emerald-500"
        />
      </div>

      <ListContainer
        title="Bugungi jadval"
        description="Sizga tayinlangan ishlar"
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
        {jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">
            Bugun sizga tayinlangan ish yo'q.
          </div>
        ) : viewMode === "list" ? (
          jobs.map((job) => {
            const config = JOB_TYPE_CONFIG[job.job_type ?? "electrical"]
            const time =
              job.scheduled_start && job.scheduled_end
                ? `${job.scheduled_start} - ${job.scheduled_end}`
                : undefined

            return (
              <InfoListItem
                key={job.id}
                icon={config.icon}
                iconBg={config.iconBg}
                iconColor={config.iconColor}
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
