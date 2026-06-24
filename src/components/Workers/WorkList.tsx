import { Zap, Droplets, Wrench, type LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import InfoModal from "./InfoModel"

export interface Task {
  id: number
  title: string
  address: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
}

const TASKS: Task[] = [
  { id: 1, title: "Ofis simlarini ta'mirlash", address: "42 Amir Temur", icon: Zap, iconColor: "text-amber-500", iconBg: "bg-amber-500/10" },
  { id: 2, title: "Quvur sizishi", address: "3 Yunusobod", icon: Droplets, iconColor: "text-blue-500", iconBg: "bg-blue-500/10" },
  { id: 3, title: "Eshik o'rnatish", address: "17 Chilonzor", icon: Wrench, iconColor: "text-emerald-500", iconBg: "bg-emerald-500/10"},
]

export default function WorkList() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-bold">Ishlar ro'yxati</CardTitle>
        <span className="text-sm text-muted-foreground">{TASKS.length} ta vazifa</span>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-3">
        {TASKS.map((task) => (
          <div 
            key={task.id} 
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/20 transition-colors"
          >
            {/* Chap tomon: Icon va ma'lumot */}
            <div className="flex items-center gap-4">
              <div className={cn("p-2.5 rounded-lg", task.iconBg)}>
                <task.icon className={cn("h-5 w-5", task.iconColor)} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">{task.title}</h4>
                <p className="text-xs text-muted-foreground">{task.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-medium">
                Boshlash
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-medium">
                Tugatish
              </Button>
              <InfoModal />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}