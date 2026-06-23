import { Wrench, Users, AlertCircle } from "lucide-react"
import { StatCard } from "@/components/Admin/dashboard/StatCard"
import { RecentJobs } from "./RecentJobs"

export default function Dashboard() {
  const statCardInfo = [
    {
      title: "Active Technicians",
      value: 12,
      icon: <Users size={18} className="text-blue-500" />,
    },
    {
      title: "Total Jobs Today",
      value: 24,
      icon: <Wrench size={18} className="text-amber-500" />,
    },
    {
      title: "Unassigned Dispatches",
      value: 3,
      icon: <AlertCircle size={18} className="text-destructive" />,
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
          />
        ))}
      </div>

      <RecentJobs />
    </div>
  )
}
