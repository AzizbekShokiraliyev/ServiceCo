import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface SharedStatCardProps {
  title: string
  value: number | string
  subtext?: string
  icon: LucideIcon
  iconColor?: string
  valueColor?: string
}

export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  iconColor = "text-muted-foreground",
  valueColor = "text-foreground",
}: SharedStatCardProps) {
  return (
    <Card>
      <div className="rounded-xl border-border/50 shadow-sm">
        <CardHeader>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>
              <div className="text-sm font-medium text-muted-foreground">
                {title}
              </div>
            </CardTitle>
            <div className="rounded-lg border border-border/40 bg-muted/80 p-2">
              <Icon className={`h-4 w-4 ${iconColor}`} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div
              className={`text-3xl font-extrabold tracking-tight ${valueColor}`}
            >
              {value}
            </div>
            {subtext && (
              <div className="mt-1 text-xs text-muted-foreground">
                {subtext}
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
