import { Users, ClipboardList, AlertCircle } from "lucide-react"

interface OrderStatsProps {
  total: number
  open: number
  resolved: number
}

const OrderStats = ({ total, open, resolved }: OrderStatsProps) => {
  const items = [
    { label: "Jami muammolar", value: total, icon: ClipboardList, bg: "bg-blue-500/15", text: "text-blue-500" },
    { label: "Ochiq", value: open, icon: AlertCircle, bg: "bg-amber-500/15", text: "text-amber-500" },
    { label: "Yechilgan", value: resolved, icon: Users, bg: "bg-teal-500/15", text: "text-teal-500" },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div key={item.label} className="rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bg}`}>
                <Icon className={`h-4 w-4 ${item.text}`} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold tabular-nums">{item.value}</p>
          </div>
        )
      })}
    </div>
  )
}

export default OrderStats