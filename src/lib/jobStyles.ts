import { Zap, Droplet, Wind } from "lucide-react"
import type { JobStatus, JobStatusConfig, JobType, JobTypeConfig } from "@/interface/Interface"

export const JOB_STATUS_CONFIG: Record<JobStatus, JobStatusConfig> = {
  pending: {
    label: "Kutilmoqda",
    className: "text-amber-500 border-amber-500/30", 
  },
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

export const JOB_TYPE_CONFIG: Record<JobType, JobTypeConfig> = {
  electrical: {
    label: "Elektrik",
    icon: Zap,
    bg: "bg-yellow-500/10",
    text: "text-yellow-500",
  },
  plumbing: {
    label: "Santexnik",
    icon: Droplet,
    bg: "bg-cyan-500/10",
    text: "text-cyan-500",
  },
  hvac: {
    label: "Konditsioner",
    icon: Wind,
    bg: "bg-orange-500/10",
    text: "text-orange-500",
  },
}