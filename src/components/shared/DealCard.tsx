// import { User } from "lucide-react"
// import { Card } from "@/components/ui/card"
// import { getDealTimeStatus } from "@/lib/getDealTimeStatus"
// import { cn } from "@/lib/utils"
// import type { DealCardProps } from "@/interface/Interface"

// export const DealCard = ({ deal, isDragging }: DealCardProps) => {
//   const timeStatus = getDealTimeStatus(deal.startTime, deal.endTime)

//   return (
//     <Card
//       className={cn(
//         "flex cursor-grab flex-col gap-2 rounded-xl border border-border/50 bg-card p-3.5 shadow-sm",
//         "transition-all duration-200 hover:border-border/80 hover:bg-accent/10 hover:shadow-md",
//         "active:cursor-grabbing",
//         isDragging && "opacity-30",
//         timeStatus
//       )}
//     >
//       <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
//         <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
//         <span className="max-w-[120px] truncate font-semibold">
//           {deal.client}
//         </span>
//       </div>

//       <h4 className="text-sm leading-snug font-semibold tracking-tight text-foreground/90">
//         {deal.title}
//       </h4>
//     </Card>
//   )
// }
