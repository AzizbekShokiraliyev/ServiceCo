import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface InfoCardProps {
  icon: LucideIcon
  label: string
  value: string
}

export function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-lg font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}
