import { Zap, Droplet, Wind, type LucideIcon } from "lucide-react"
import type {
  ClientDealStatus,
  JobStatus,
  JobType,
} from "@/interface/Interface"

export const ClientStatusStyles: Record<ClientDealStatus, string> = {
  new: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  in_progress: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  won: "bg-green-500/10 text-green-500 border-green-500/20",
  lost: "bg-red-500/10 text-red-500 border-red-500/20",
}

export const JobStatusStyles: Record<JobStatus, string> = {
  pending: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  in_progress: "bg-sky-500/10 text-sky-500 border-sky-500/20 ",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
}

export const JobTypeStyles: Record<JobType, { icon: LucideIcon; bg: string }> =
  {
    electrical: {
      icon: Zap,
      bg: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    },
    plumbing: {
      icon: Droplet,
      bg: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    },
    hvac: {
      icon: Wind,
      bg: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    },
  }
