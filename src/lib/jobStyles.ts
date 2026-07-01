import { Zap, Droplet, Wind } from "lucide-react"
import type {
  JobStatus,
  JobStatusConfig,
  JobType,
  JobTypeConfig,
} from "@/interface/Interface"

export const JOB_STATUS_CONFIG: Record<JobStatus, JobStatusConfig> = {
  pending: {
    label: "Kutilmoqda",
    className: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  },
  on_way: {
    label: "Yo'lda",
    className: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  },
  in_progress: {
    label: "Jarayonda",
    className: "bg-violet-500/15 text-violet-600 border-violet-500/20",
  },
  completed: {
    label: "Bajarildi",
    className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  },
  // Ilgari bu yozuv yo'q edi — shuning uchun rad etilgan ish "Kutilmoqda"
  // (yoki bo'sh) ko'rinib qolar edi.
  rejected: {
    label: "Rad etildi",
    className: "bg-red-500/15 text-red-600 border-red-500/20",
  },
}

export const JOB_TYPE_CONFIG: Record<JobType, JobTypeConfig> = {
  electrical: {
    label: "Elektrik",
    icon: Zap,
    bg: "bg-amber-500/10",
    text: "text-amber-600",
  },
  plumbing: {
    label: "Santexnika",
    icon: Droplet,
    bg: "bg-blue-500/10",
    text: "text-blue-600",
  },
  hvac: {
    label: "Konditsioner",
    icon: Wind,
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
  },
}