import { useNavigate } from "react-router-dom"
import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useTasks } from "@/hooks/useTasks"

export default function WorkList() {
  const navigate = useNavigate()
  const { tasks } = useTasks()

  return (
    <Card className="w-full border-border/50">
      <CardHeader className="border-b pb-3">
        <CardTitle className="flex justify-between text-base font-bold">
          Ishlar ro&apos;yxati
          <span className="text-sm font-normal text-muted-foreground">
            {tasks.length} ta vazifa
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pt-6">
        {tasks.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Bugun uchun vazifalar qolmadi 🎉
          </p>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => navigate(`/client/${task.id}`)}
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
