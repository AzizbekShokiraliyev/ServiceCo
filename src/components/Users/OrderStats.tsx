import { Users, ClipboardList, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrderStatsProps {
  total: number
  open: number
  resolved: number
}

export default function OrderStats({ total, open, resolved }: OrderStatsProps) {
  const stats = [
    {
      label: "Jami muammolar",
      value: total,
      icon: ClipboardList,
      color: "text-blue-500",
    },
    { label: "Ochiq", value: open, icon: AlertCircle, color: "text-amber-500" },
    {
      label: "Yechilgan",
      value: resolved,
      icon: Users,
      color: "text-emerald-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
