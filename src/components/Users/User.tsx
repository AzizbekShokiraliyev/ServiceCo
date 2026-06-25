import UserModal from "@/components/Users/UserModal"
import { StatCard } from "@/components/shared/StatCard"
import { ListContainer } from "@/components/shared/ListContainer"
import { InfoListItem } from "@/components/shared/InfoListItem"
import {
  Users,
  ClipboardList,
  AlertCircle,
  Wind,
  Droplet,
  Zap,
  MapPin,
} from "lucide-react"

const MOCK_ORDERS = [
  {
    id: "1",
    title: "Login qilolmayapman",
    category: "hvac",
    status: "in_progress",
    duration: "2.5 soat",
    location: "Toshkent",
  },
  {
    id: "2",
    title: "To'lov amalga oshmadi",
    category: "plumbing",
    status: "on_way",
    duration: "4 soat",
    location: "Chilonzor",
  },
  {
    id: "3",
    title: "Buyurtma kelmadi",
    category: "electrical",
    status: "completed",
    duration: "1.5 soat",
    location: "Yunusobod",
  },
]

const catConfig = {
  hvac: { icon: Wind, bg: "bg-orange-500/10", text: "text-orange-500" },
  plumbing: { icon: Droplet, bg: "bg-cyan-500/10", text: "text-cyan-500" },
  electrical: { icon: Zap, bg: "bg-yellow-500/10", text: "text-yellow-500" },
} as const

const statConfig = {
  on_way: {
    label: "Yo'lda",
    className: "text-muted-foreground border-border/60",
  },
  in_progress: {
    label: "Jarayonda",
    className: "text-blue-400 border-blue-500/30",
  },
  completed: {
    label: "Bajarildi",
    className: "text-emerald-400 border-emerald-500/30",
  },
}

export default function User() {
  const open = MOCK_ORDERS.filter((o) => o.status !== "completed").length
  const resolved = MOCK_ORDERS.filter((o) => o.status === "completed").length

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-3xl font-bold tracking-tight">
            Mening buyurtmalarim
          </div>
          <div className="mt-1 text-muted-foreground">
            Yuborilgan muammolaringiz va ularning holati
          </div>
        </div>
        <div>
          <UserModal />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Jami muammolar"
          value={MOCK_ORDERS.length}
          icon={ClipboardList}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Ochiq"
          value={open}
          icon={AlertCircle}
          iconColor="text-amber-500"
        />
        <StatCard
          title="Yechilgan"
          value={resolved}
          icon={Users}
          iconColor="text-emerald-500"
        />
      </div>

      <ListContainer
        title="So'nggi murojaatlar"
        description="Barcha yuborilgan so'rovlaringiz tarixi"
      >
        {MOCK_ORDERS.length === 0 ? (
          <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
            Hozircha buyurtmalar yo'q.
          </div>
        ) : (
          MOCK_ORDERS.map((order) => {
            const category = catConfig[order.category as keyof typeof catConfig]
            const status = statConfig[order.status as keyof typeof statConfig]

            return (
              <InfoListItem
                key={order.id}
                icon={category.icon}
                iconBg={category.bg}
                iconColor={category.text}
                title={order.title}
                duration={order.duration}
                statusLabel={status.label}
                statusClassName={status.className}
                subtitle={
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" /> {order.location}
                  </span>
                }
              />
            )
          })
        )}
      </ListContainer>
    </div>
  )
}
