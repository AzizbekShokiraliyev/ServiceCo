import { Clock } from "lucide-react"

interface InfoListItemProps {
  icon: React.ElementType
  iconBg?: string
  iconColor?: string
  title: string
  subtitle?: React.ReactNode
  duration?: string
  statusLabel?: string
  statusClassName?: string
  onClick?: () => void // <-- Added for navigation
}

export function InfoListItem({
  icon: Icon,
  iconBg = "bg-muted",
  iconColor,
  title,
  subtitle,
  duration,
  statusLabel,
  statusClassName,
  onClick,
}: InfoListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col justify-between gap-4 rounded-xl border border-border/40 bg-card/40 p-4 transition-all hover:bg-accent/30 sm:flex-row sm:items-center ${
        onClick ? "cursor-pointer active:scale-[0.99]" : ""
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${iconBg}`}
        >
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>

        <div className="space-y-1">
          <div className="text-sm font-semibold text-foreground">{title}</div>
          {subtitle && (
            <div className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3">
        {duration && (
          <div className="flex h-[25px] min-w-[100px] items-center justify-center gap-1 rounded-md border bg-muted px-2 text-xs font-medium text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{duration}</span>
          </div>
        )}

        {statusLabel && (
          <div
            className={`min-w-[95px] rounded-lg border px-2.5 py-0.5 text-center text-xs font-semibold tracking-wide capitalize shadow-sm ${statusClassName}`}
          >
            {statusLabel}
          </div>
        )}
      </div>
    </div>
  )
}
