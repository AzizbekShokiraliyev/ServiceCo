import { Wifi, CreditCard, Truck, Wrench, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Order {
  id: string
  title: string
  category: "internet" | "payment" | "delivery" | "other"
  status: "pending" | "in_progress" | "resolved" | "rejected"
  createdAt: string
  duration: string
}

const categoryConfig = {
  internet: { icon: Wifi, bg: "bg-coral-500/15", text: "text-coral-500" },
  payment: { icon: CreditCard, bg: "bg-blue-500/15", text: "text-blue-500" },
  delivery: { icon: Truck, bg: "bg-amber-500/15", text: "text-amber-500" },
  other: { icon: Wrench, bg: "bg-purple-500/15", text: "text-purple-500" },
} as const

const statusConfig = {
  pending: { label: "Kutilmoqda", className: "bg-muted text-muted-foreground" },
  in_progress: { label: "Jarayonda", className: "bg-blue-500/15 text-blue-500" },
  resolved: { label: "Yechildi", className: "bg-teal-500/15 text-teal-500" },
  rejected: { label: "Rad etildi", className: "bg-red-500/15 text-red-500" },
} as const

interface OrderCardProps {
  order: Order
}

const OrderCard = ({ order }: OrderCardProps) => {
  const category = categoryConfig[order.category]
  const status = statusConfig[order.status]
  const Icon = category.icon

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-card/50 p-4 transition-colors hover:bg-card">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            category.bg
          )}
        >
          <Icon className={cn("h-5 w-5", category.text)} />
        </div>

        <div className="min-w-0">
          <p className="truncate font-medium leading-tight">{order.title}</p>
          <p className="text-xs text-muted-foreground">{order.createdAt}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {order.duration}
        </div>

        <div
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            status.className
          )}
        >
          {status.label}
        </div>
      </div>
    </div>
  )
}

export default OrderCard