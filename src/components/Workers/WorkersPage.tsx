import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Zap,
  Droplets,
  Wrench,
  LayoutList,
  CalendarDays,
  Briefcase,
  CheckCircle,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorkersHeader from "./WorkersHeader"
import { StatCard } from "@/components/shared/StatCard"
import { ListContainer } from "@/components/shared/ListContainer"
import { InfoListItem } from "@/components/shared/InfoListItem"
import {
  Timeline,
  type TimelineRow,
  type TimelineEvent,
} from "@/components/shared/timeLine/Timeline"

const DUMMY_TASKS = [
  {
    id: "t1",
    title: "Ofis simlarini ta'mirlash",
    subtitle: "5-bino, 3-qavat",
    time: "08:00 - 10:00",
    startTime: "08:00",
    endTime: "10:00",
    icon: Zap,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    id: "t2",
    title: "Quvur sizishi",
    subtitle: "Chilonzor, 12-uy",
    time: "10:30 - 12:00",
    startTime: "10:30",
    endTime: "12:00",
    icon: Droplets,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    id: "t3",
    title: "Eshik o'rnatish",
    subtitle: "Yunusobod",
    time: "13:00 - 15:00",
    startTime: "13:00",
    endTime: "15:00",
    icon: Wrench,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
]

const WORKER_ROW: TimelineRow[] = [
  {
    id: "worker-1",
    label: "Aleks Mirzayev",
    sublabel: "Elektrik & Santexnik",
    avatarChar: "A",
  },
]

const WORKER_EVENTS: TimelineEvent[] = DUMMY_TASKS.map((t) => ({
  id: t.id,
  rowId: "worker-1",
  title: t.title,
  subtitle: t.subtitle,
  startTime: t.startTime,
  endTime: t.endTime,
}))

type ViewMode = "list" | "timeline"

export default function WorkersPage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  return (
    <main className="space-y-6">
      <WorkersHeader name="Aleks Mirzayev" role="Elektrik & Santexnik" />

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

      <ListContainer
        title="Bugungi jadval"
        description="Sizga tayinlangan ishlar"
        headerAction={
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
          >
            <TabsList>
              <TabsTrigger value="list" className="gap-1.5">
                <LayoutList className="h-4 w-4" />
                Ro'yxat
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-1.5">
                <CalendarDays className="h-4 w-4" />
                Timeline
              </TabsTrigger>
            </TabsList>
          </Tabs>
        }
      >
        {viewMode === "list" ? (
          DUMMY_TASKS.map((task) => (
            <InfoListItem
              key={task.id}
              icon={task.icon}
              iconBg={task.iconBg}
              iconColor={task.iconColor}
              title={task.title}
              duration={task.time}
              onClick={() => navigate(`/workers/client/${task.id}`)}
            />
          ))
        ) : (
          <div className="pt-2">
            <Timeline
              rows={WORKER_ROW}
              events={WORKER_EVENTS}
              height="h-[140px]"
              readOnly
            />
          </div>
        )}
      </ListContainer>
    </main>
  )
}
