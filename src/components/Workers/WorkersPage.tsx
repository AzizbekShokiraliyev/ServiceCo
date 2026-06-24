import WorkList from "./WorkList"
import WorkersHeader from "./WorkersHeader"
import StatCard from "./StatCard"
import { Briefcase, CheckCircle } from "lucide-react"

export default function WorkersPage() {
  return (
    // mx-auto qo'shildi
    <div className="container mx-auto px-4 py-6"> 
      <main className="space-y-6">
        <WorkersHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard label="Bugungi ishlar" value={3} sub="24-iyun 2026" icon={Briefcase} />
          <StatCard label="Bajarilganlar" value={1} sub="2 ta qoldi" icon={CheckCircle} valueColor="text-emerald-500" />
        </div>
        <WorkList />
      </main>
    </div>
  )
}