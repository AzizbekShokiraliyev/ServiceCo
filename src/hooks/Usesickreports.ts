import { supabase } from "@/lib/supaBase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { SickReport } from "@/interface/Interface"
import type { SickInfoMap } from "@/lib/sickReportUtils"

export type SickReportPayload = {
  technician_id: string
  reason: string
  start_date: string // "YYYY-MM-DD"
  end_date: string // "YYYY-MM-DD"
}

// yangi kasallik xabari yaratish + shu texnikning faol ishlarini bo'shatish
export const useSickReportCreate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SickReportPayload) => {
      const { data, error } = await supabase
        .from("sick_reports")
        .insert(payload)
        .select()
        .single()

      if (error) throw error

      const today = new Date().toISOString().slice(0, 10)
      const isActiveNow =
        payload.start_date <= today && today <= payload.end_date

      // Kasallik bugundan boshlangan bo'lsa — texnikning faol ishlarini
      // "Works" ustuniga (tayinlanmaganlar) qaytaramiz.
      if (isActiveNow) {
        const { error: jobsError } = await supabase
          .from("jobs")
          .update({
            technician_id: null,
            status: "pending", // ⚠️ tayinlanmagan status shu bo'lsa
            scheduled_start: null,
            scheduled_end: null,
          })
          .eq("technician_id", payload.technician_id)
          .not("status", "in", '("completed","rejected")')

        if (jobsError) throw jobsError
      }

      return data as SickReport
    },
    onSuccess: (created) => {
      queryClient.setQueryData<SickReport[]>(["sick_reports"], (old) =>
        old ? [created, ...old] : [created]
      )
      queryClient.invalidateQueries({ queryKey: ["sick_reports"] })
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
    },
  })
}

// barcha xabarlar (tarix uchun)
export const useSickReports = () => {
  return useQuery({
    queryKey: ["sick_reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sick_reports")
        .select(
          `
          *,
          technician:technicians(id, full_name, skill)
        `
        )
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as SickReport[]
    },
  })
}

// bitta texnikning tarixi
export const useSickReportsByTechnician = (technicianId?: string) => {
  return useQuery({
    queryKey: ["sick_reports", "technician", technicianId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sick_reports")
        .select("*")
        .eq("technician_id", technicianId!)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as SickReport[]
    },
    enabled: !!technicianId,
  })
}

// Bugun kasal bo'lgan texniklar — sana oralig'iga qarab (admin/kanban uchun)
export const useTechniciansSickToday = () => {
  return useQuery({
    queryKey: ["sick_reports", "today"],
    queryFn: async (): Promise<SickInfoMap> => {
      const today = new Date().toISOString().slice(0, 10)

      const { data, error } = await supabase
        .from("sick_reports")
        .select("technician_id, reason, start_date, end_date")
        .lte("start_date", today)
        .gte("end_date", today)
        .order("created_at", { ascending: false })

      if (error) throw error

      const map: SickInfoMap = new Map()
      for (const r of data ?? []) {
        if (!map.has(r.technician_id)) {
          map.set(r.technician_id, {
            reason: r.reason,
            startDate: r.start_date,
            endDate: r.end_date,
          })
        }
      }
      return map
    },
    refetchInterval: 5 * 60 * 1000,
  })
}