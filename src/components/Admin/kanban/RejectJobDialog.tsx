"use client"

import { Trash2 } from "lucide-react"
import { useJobReject } from "@/hooks/useJobs"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { toast } from "sonner"

export function RejectJobDialog({ dealId }: { dealId: string }) {
  const { mutate: rejectJob, isPending } = useJobReject()

  const handleReject = () => {
    rejectJob(dealId, {
      onSuccess: () => {
        toast.success("Ish rad etildi", {
          description: "Buyurtma qaytarildi va foydalanuvchiga xabar berildi.",
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
    })
  }

  return (
    <ConfirmDialog
      title="Buyurtmani rad etish"
      description="Haqiqatan ham bu buyurtmani bekor qilmoqchimisiz? Foydalanuvchi profili orqali bu haqida xabardor qilinadi."
      confirmLabel="Rad etish"
      cancelLabel="Orqaga"
      variant="destructive"
      onConfirm={handleReject}
      trigger={
        <button
          type="button"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          disabled={isPending}
          title="Rad etish"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      }
    />
  )
}
