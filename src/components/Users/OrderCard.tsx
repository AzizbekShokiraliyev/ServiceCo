import { Wind, Droplet, Zap, MapPin, User, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type JobStatus = "on_way" | "in_progress" | "completed"

export interface Order {
  id: string
  title: string
  location?: string // Optional: not all orders might have a location
  technician?: string // Optional: not all orders might have an assigned tech
  category:
    | "hvac"
    | "plumbing"
    | "electrical"
    | "other"
    | "payment"
    | "delivery"
    | "internet"
  status: JobStatus
  duration: string
  createdAt: string
}

const categoryConfig = {
  hvac: { icon: Wind, bg: "bg-orange-500/10", text: "text-orange-500" },
  plumbing: { icon: Droplet, bg: "bg-cyan-500/10", text: "text-cyan-500" },
  electrical: { icon: Zap, bg: "bg-yellow-500/10", text: "text-yellow-500" },
  other: { icon: User, bg: "bg-gray-500/10", text: "text-gray-500" },
  payment: { icon: Zap, bg: "bg-green-500/10", text: "text-green-500" },
  delivery: { icon: MapPin, bg: "bg-blue-500/10", text: "text-blue-500" },
  internet: { icon: Zap, bg: "bg-purple-500/10", text: "text-purple-500" },
} as const

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
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

export default function OrderCard({ order }: { order: Order }) {
  const category = categoryConfig[order.category] || categoryConfig.other
  const status = statusConfig[order.status]
  const Icon = category.icon

  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-border/50 bg-card/40 p-4 transition-all hover:bg-accent/20 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-4">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
            category.bg
          )}
        >
          <Icon className={cn("h-5 w-5", category.text)} strokeWidth={1.5} />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="truncate text-[15px] font-semibold text-foreground">
            {order.title}
          </p>
          <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
            {order.location && (
              <span className="flex items-center gap-1.5 truncate">
                <MapPin className="h-3.5 w-3.5" /> {order.location}
              </span>
            )}
            {order.technician && (
              <span className="flex items-center gap-1.5 truncate">
                <User className="h-3.5 w-3.5" /> {order.technician}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Badge
          variant="outline"
          className="gap-1.5 rounded-full border-border/50 bg-transparent px-3 py-1 text-xs font-normal text-muted-foreground"
        >
          <Clock className="h-3.5 w-3.5" /> {order.duration}
        </Badge>
        <Badge
          variant="outline"
          className={cn(
            "rounded-full bg-transparent px-3 py-1 text-xs font-medium",
            status.className
          )}
        >
          {status.label}
        </Badge>
      </div>
    </div>
  )
}
