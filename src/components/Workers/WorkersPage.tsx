import WorkList from "./WorkList"
import WorkersHeader from "./WorkersHeader"
import StatCard from "./StatCard"
import { Briefcase, CheckCircle } from "lucide-react"
import { useTasks } from "@/hooks/useTasks"
import { TasksProvider } from "./clinetInfo/TaskProvide"

// 1. IMPORT YOUR PROVIDER HERE
// Adjust this import path if your TasksProvider is located somewhere else

// 2. RENAME your original component to something like `WorkersPageContent`
function WorkersPageContent() {
  const { tasks, completedCount, totalCount } = useTasks()

  return (
    <div className="container mx-auto px-4 py-6">
      <main className="space-y-6">
        <WorkersHeader name="Aleks Mirzayev" role="Elektrik & Santexnik" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StatCard
            label="Bugungi ishlar"
            value={totalCount}
            sub="24-iyun 2026"
            icon={Briefcase}
          />
          <StatCard
            label="Bajarilganlar"
            value={completedCount}
            sub={`${tasks.length} ta qoldi`}
            icon={CheckCircle}
            valueColor="text-emerald-500"
          />
        </div>

        <WorkList />
      </main>
    </div>
  )
}

export default function WorkersPage() {
  return (
    <TasksProvider>
      <WorkersPageContent />
    </TasksProvider>
  )
}
