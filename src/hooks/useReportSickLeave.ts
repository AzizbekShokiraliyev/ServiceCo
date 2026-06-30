import { toast } from "sonner"
import { useSickReportCreate } from "./Usesickreports"

interface SubmitSickReportParams {
  technicianId?: string
  reason: string
}
export function useReportSickLeave() {
  const { mutateAsync, isPending } = useSickReportCreate()

  const submit = async ({ technicianId, reason }: SubmitSickReportParams) => {
    if (!reason.trim()) {
      toast.error("Sababni kiriting", {
        description: "Iltimos, kasallik sababini yozing.",
        position: "top-center",
      })
      return false
    }

    if (!technicianId) {
      toast.error("Texnik aniqlanmadi", {
        description: "Profil ma'lumotlari yuklanmagan, qaytadan urinib ko'ring.",
        position: "top-center",
      })
      return false
    }

    try {
      await mutateAsync({ technician_id: technicianId, reason: reason.trim() })

      toast.success("Xabar yuborildi", {
        description: "Adminga kasallik haqida xabar berildi.",
        position: "top-center",
      })
      return true
    } catch (error) {
      toast.error("Xatolik yuz berdi", {
        description:
          error instanceof Error
            ? error.message
            : "Xabarni yuborib bo'lmadi. Qaytadan urinib ko'ring.",
        position: "top-center",
      })
      return false
    }
  }

  return { submit, isSubmitting: isPending }
}