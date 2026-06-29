import { Phone } from "lucide-react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import MastersActions from "./MastersActions"

interface WorkerRowProps {
  worker: {
    id: string
    full_name: string
    skill: string
    phone: string
    description: string
  }
}

export function MastersRow({ worker }: WorkerRowProps) {
  // Ismning birinchi harfini ajratib olish (Avatar uchun)
  const initials = worker.full_name.charAt(0).toUpperCase()

  return (
    <TableRow className="group transition-colors hover:bg-muted/30">
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-primary/10">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{worker.full_name}</span>
        </div>
      </TableCell>

      <TableCell>
        <Badge
          variant="secondary"
          className="px-2.5 py-0.5 text-xs font-normal"
        >
          {worker.skill}
        </Badge>
      </TableCell>

      <TableCell className="text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5 opacity-70" />
          <span className="text-sm tabular-nums">{worker.phone}</span>
        </div>
      </TableCell>

      <TableCell className="max-w-[250px] truncate text-sm text-muted-foreground">
        {worker.description}
      </TableCell>

      <TableCell className="text-right">
        <MastersActions workerId={worker.id} />
      </TableCell>
    </TableRow>
  )
}
