import WorkersHeader from "./WorkersHeader"
import WorkList from "./WorkList"
import { StatCard } from "@/components/shared/StatCard"
import { Briefcase, CheckCircle } from "lucide-react"

export default function WorkersPage() {
  return (
    <main className="space-y-6">
      <div>
        <WorkersHeader name="Aleks Mirzayev" role="Elektrik & Santexnik" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard
          title="Bugungi ishlar"
          value={3}
          subtext="24-iyun 2026"
          icon={Briefcase}
        />
        <StatCard
          title="Bajarilganlar"
          value={1}
          subtext="2 ta qoldi"
          icon={CheckCircle}
          valueColor="text-emerald-500"
          iconColor="text-emerald-500"
        />
      </div>

      <div>
        <WorkList />
      </div>
    </main>
  )
}
