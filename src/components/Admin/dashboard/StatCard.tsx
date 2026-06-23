import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StatCardProps } from "@/interface/Interface"

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium text-muted-foreground">
            <CardTitle>{title}</CardTitle>
          </div>
          <div className="rounded-lg border border-border/40 bg-muted/80 p-2 text-muted-foreground">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-3xl font-extrabold tracking-tight text-foreground">
          {value}
        </div>
      </CardContent>
    </Card>
  )
}
