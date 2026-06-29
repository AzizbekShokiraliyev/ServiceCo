import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  className?: string
  text?: string
}

export function LoadingSpinner({
  className = "h-[50vh]",
  text = "Yuklanmoqda...",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center gap-2 text-sm text-muted-foreground ${className}`}
    >
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span>{text}</span>
    </div>
  )
}
