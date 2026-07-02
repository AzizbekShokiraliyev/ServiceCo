import { supabase } from "@/lib/supaBase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { SickReport } from "@/interface/Interface"

// yangi xabar yaratish
export const useSickReportCreate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { technician_id: string; reason: string }) => {
      const { data, error } = await supabase
        .from("sick_reports")
        .insert(payload)
        .select()
        .single()

      if (error) throw error
      return data as SickReport
    },
    onSuccess: (created) => {
      queryClient.setQueryData<SickReport[]>(["sick_reports"], (old) =>
        old ? [created, ...old] : [created]
      )
      queryClient.invalidateQueries({ queryKey: ["sick_reports", "today"] })
    },
  })
}

// barcha xabarlar
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

// bir kun cuhun
export const useSickTechnicianIdsToday = () => {
  return useQuery({
    queryKey: ["sick_reports", "today"],
    queryFn: async () => {
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from("sick_reports")
        .select("technician_id, reason, created_at")
        .gte("created_at", startOfDay.toISOString())
        .order("created_at", { ascending: false })

      if (error) throw error

      const map = new Map<string, string>()
      for (const r of data ?? []) {
        if (!map.has(r.technician_id)) {
          map.set(r.technician_id, r.reason)
        }
      }
      return map
    },
  })
}