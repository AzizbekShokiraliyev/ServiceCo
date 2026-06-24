import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: number | string
  sub: string
  icon: LucideIcon
  valueColor?: string
}

export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  valueColor,
}: StatCardProps) {
  return (
    <Card>
      {/* FIX: added explicit p-6 — shadcn CardContent strips padding by default in some setups */}
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className="rounded-lg bg-muted p-2">
            <Icon size={16} className="text-muted-foreground" />
          </div>
        </div>
        <div
          className={`text-4xl font-bold tracking-tight ${valueColor ?? "text-foreground"}`}
        >
          {value}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  )
}
