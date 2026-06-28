import { StatCard } from "@/components/shared/StatCard"
import { ListContainer } from "@/components/shared/ListContainer"
import { InfoListItem } from "@/components/shared/InfoListItem"
import {
  Users,
  ClipboardList,
  AlertCircle,
  Wind,
  Droplet,
  Zap,
  MapPin,
} from "lucide-react"
import UserModal from "./UserModal"
import { useJobs } from "@/hooks/useJobs"
import { useProfile } from "@/hooks/useProfile"
import type { JobType, JobStatus } from "@/interface/Interface"

const catConfig: Record<
  JobType,
  { icon: React.ElementType; bg: string; text: string }
> = {
  hvac: { icon: Wind, bg: "bg-orange-500/10", text: "text-orange-500" },
  plumbing: { icon: Droplet, bg: "bg-cyan-500/10", text: "text-cyan-500" },
  electrical: { icon: Zap, bg: "bg-yellow-500/10", text: "text-yellow-500" },
}

const statConfig: Record<JobStatus, { label: string; className: string }> = {
  on_way: {
    label: "Yo'lda",
    className: "text-muted-foreground border-border/60",
  },
  in_progress: {
    label: "Jarayonda",
    className: "text-blue-400 border-blue-500/30",
  },
  completed: {
    label: "Bajarildi",
    className: "text-emerald-400 border-emerald-500/30",
  },
}

export default function User() {
  const { data: profile } = useProfile()

  // ✅ Faqat shu user yaratgan joblarni olish
  const { data: jobs = [], isLoading } = useJobs()
  const myJobs = jobs.filter((j) => j.created_by === profile?.id)

  const open = myJobs.filter((j) => j.status !== "completed").length
  const resolved = myJobs.filter((j) => j.status === "completed").length

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-3xl font-bold tracking-tight">
            Mening buyurtmalarim
          </div>
          <div className="mt-1 text-muted-foreground">
            Yuborilgan muammolaringiz va ularning holati
          </div>
        </div>
        <UserModal />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Jami muammolar"
          value={myJobs.length}
          icon={ClipboardList}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Ochiq"
          value={open}
          icon={AlertCircle}
          iconColor="text-amber-500"
        />
        <StatCard
          title="Yechilgan"
          value={resolved}
          icon={Users}
          iconColor="text-emerald-500"
        />
      </div>

      <ListContainer
        title="So'nggi murojaatlar"
        description="Barcha yuborilgan so'rovlaringiz tarixi"
      >
        {isLoading ? (
          <div className="animate-pulse py-10 text-center text-sm text-muted-foreground">
            Yuklanmoqda...
          </div>
        ) : myJobs.length === 0 ? (
          <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
            Hozircha buyurtmalar yo'q.
          </div>
        ) : (
          myJobs.map((job) => {
            const category = catConfig[job.job_type ?? "electrical"]
            const status = statConfig[job.status]

            return (
              <InfoListItem
                key={job.id}
                icon={category.icon}
                iconBg={category.bg}
                iconColor={category.text}
                title={job.title}
                statusLabel={status.label}
                statusClassName={status.className}
                subtitle={
                  job.address ? (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" /> {job.address}
                    </span>
                  ) : undefined
                }
              />
            )
          })
        )}
      </ListContainer>
    </div>
  )
}
