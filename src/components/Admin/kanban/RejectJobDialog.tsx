import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useJobUpdate } from "@/hooks/useJobs"

export function RejectJobDialog({ dealId }: { dealId: string }) {
  const { mutate: updateJob, isPending } = useJobUpdate()

  const handleReject = () => {
    updateJob(
      { id: dealId, status: "rejected" },
      {
        onSuccess: () => {
          toast.success("Ish rad etildi", {
            description:
              "Buyurtma qaytarildi va foydalanuvchiga xabar berildi.",
            position: "top-center",
          })
        },
        onError: (error) => {
          toast.error("Xatolik yuz berdi", {
            description:
              error instanceof Error
                ? error.message
                : "Ishni rad etib bo'lmadi. Qaytadan urinib ko'ring.",
            position: "top-center",
          })
        },
      }
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          onPointerDown={(e) => e.stopPropagation()} // DND (Drag) ishlab ketmasligi uchun
          onClick={(e) => e.stopPropagation()} // Click ham o'zida qoladi
          disabled={isPending}
          title="Rad etish"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Buyurtmani rad etish</AlertDialogTitle>
          <AlertDialogDescription>
            Haqiqatan ham bu buyurtmani bekor qilmoqchimisiz? Foydalanuvchi
            profili orqali bu haqida xabardor qilinadi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Orqaga</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReject}
            disabled={isPending}
            className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
          >
            Rad etish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
