import { Wrench, Users, AlertCircle } from "lucide-react"
import { StatCard } from "@/components/shared/StatCard"
import { RecentJobs } from "./RecentJobs"

export default function Dashboard() {
  const statCardInfo = [
    {
      title: "Active Technicians",
      value: 12,
      icon: Users,
      iconColor: "text-blue-500",
    },
    {
      title: "Total Jobs Today",
      value: 24,
      icon: Wrench,
      iconColor: "text-amber-500",
    },
    {
      title: "Unassigned Dispatches",
      value: 3,
      icon: AlertCircle,
      iconColor: "text-destructive",
    },
  ]

  return (
    <div className="mx-auto space-y-6 p-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCardInfo.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            iconColor={item.iconColor}
          />
        ))}
      </div>

      <RecentJobs />
    </div>
  )
}
