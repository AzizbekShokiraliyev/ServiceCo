import { Clock, Zap, Droplets, Wrench } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
  return (
    <Card className="w-full border-border/50">
      <CardHeader className="border-b pb-3">
        <CardTitle className="flex justify-between text-base font-bold">
          Ishlar ro'yxati
          <span className="text-sm font-normal text-muted-foreground">
            3 ta vazifa
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pt-6">
        {DUMMY_TASKS.map((task) => (
          <div
            key={task.id}
            className="flex cursor-pointer items-center justify-between rounded-xl border border-border/50 bg-card p-4 transition-all hover:bg-accent/30"
          >
            <div className="flex items-center gap-4">
              <div className={cn("rounded-lg p-2.5", task.iconBg)}>
                <task.icon className={cn("h-5 w-5", task.iconColor)} />
              </div>
              <h4 className="text-sm font-semibold text-foreground">
                {task.title}
              </h4>
            </div>

            <div className="flex items-center gap-1.5 rounded-md bg-accent/50 px-3 py-1 text-xs font-medium">
              <Clock className="h-3 w-3" />
              {task.time}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
