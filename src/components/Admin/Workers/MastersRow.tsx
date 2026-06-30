import { Phone } from "lucide-react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import MastersActions from "./MastersActions"
import type { Technician } from "@/interface/Interface"

const SKILL_CONFIG: Record<string, { label: string; className: string }> = {
  Electrical: {
    label: "Elektrik",
    className:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  Plumbing: {
    label: "Santexnik",
    className:
      "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  HVAC: {
    label: "Konditsioner",
    className:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
}

const AVATAR_COLORS = [
  "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  "bg-rose-500/15 text-rose-600 dark:text-rose-400",
]

function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

interface MastersRowProps {
  worker: Technician
}

export function MastersRow({ worker }: MastersRowProps) {
  const initials = worker.full_name.charAt(0).toUpperCase()
  const skillInfo = SKILL_CONFIG[worker.skill]

  return (
    <TableRow className="h-16 hover:bg-muted/50">
      <TableCell className="w-[200px] font-medium">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9">
            <Avatar>
              <AvatarFallback
                className={`font-semibold ${getAvatarColor(worker.full_name)}`}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <span className="truncate">{worker.full_name}</span>
        </div>
      </TableCell>

      <TableCell className="w-[200px]">
        <Badge
          variant="outline"
          className={`w-[150px] justify-center font-medium ${skillInfo?.className ?? ""}`}
        >
          {skillInfo?.label ?? worker.skill}
        </Badge>
      </TableCell>

      <TableCell className="w-[200px]">
        {worker.phone ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <span className="tabular-nums">{worker.phone}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground/50">Noma'lum</span>
        )}
      </TableCell>

      <TableCell className="max-w-[280px] truncate">
        {worker.description ? (
          <span className="text-muted-foreground">{worker.description}</span>
        ) : (
          <span className="text-muted-foreground/50 italic">Tavsif yo'q</span>
        )}
      </TableCell>

      <TableCell className="w-[100px] text-right">
        <MastersActions worker={worker} />
      </TableCell>
    </TableRow>
  )
}
