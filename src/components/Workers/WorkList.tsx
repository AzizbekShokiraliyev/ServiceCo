import { useNavigate } from "react-router-dom"
import { Zap, Droplets, Wrench } from "lucide-react"
import { ListContainer } from "@/components/shared/ListContainer"
import { InfoListItem } from "@/components/shared/InfoListItem"

const DUMMY_TASKS = [
  {
    id: 1,
    title: "Ofis simlarini ta'mirlash",
    time: "8:00 - 10:00",
    icon: Zap,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    id: 2,
    title: "Quvur sizishi",
    time: "10:30 - 12:00",
    icon: Droplets,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    id: 3,
    title: "Eshik o'rnatish",
    time: "13:00 - 15:00",
    icon: Wrench,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
]

export default function WorkList() {
  const navigate = useNavigate()

  return (
    <ListContainer
      title="Ishlar ro'yxati"
      headerAction={
        <div className="text-sm font-normal text-muted-foreground">
          3 ta vazifa
        </div>
      }
    >
      {DUMMY_TASKS.map((task) => (
        <InfoListItem
          key={task.id}
          icon={task.icon}
          iconBg={task.iconBg}
          iconColor={task.iconColor}
          title={task.title}
          duration={task.time}
          onClick={() => navigate(`/workers/client/${task.id}`)}
        />
      ))}
    </ListContainer>
  )
}
