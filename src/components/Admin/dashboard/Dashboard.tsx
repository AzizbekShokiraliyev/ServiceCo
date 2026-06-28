import { Wrench, Users, AlertCircle } from "lucide-react"
import { StatCard } from "@/components/shared/StatCard"
import { RecentJobs } from "./RecentJobs"
import { useJobs } from "@/hooks/useJobs"
import { useTechnicians } from "@/hooks/useTechnicians"

function getTodayPrefix() {
  return new Date().toISOString().split("T")[0]
}

export default function Dashboard() {
  const { data: jobs = [], isLoading: jobsLoading } = useJobs()
  const { data: technicians = [], isLoading: techLoading } = useTechnicians()

  const todayPrefix = getTodayPrefix()

  const todayJobCount = jobs.filter((j) =>
    j.created_at.startsWith(todayPrefix)
  ).length
  const unassignedJobCount = jobs.filter((j) => !j.technician_id).length
  const activeTechCount = technicians.length

  const stats = [
    {
      title: "Faol texniklar",
      value: techLoading ? "…" : activeTechCount,
      icon: Users,
      iconColor: "text-blue-500",
    },
    {
      title: "Bugungi ishlar",
      value: jobsLoading ? "…" : todayJobCount,
      icon: Wrench,
      iconColor: "text-amber-500",
    },
    {
      title: "Tayinlanmagan ishlar",
      value: jobsLoading ? "…" : unassignedJobCount,
      icon: AlertCircle,
      iconColor: "text-destructive",
    },
  ]

  return (
    <div className="mx-auto space-y-6 p-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      <RecentJobs />
    </div>
  )
}
