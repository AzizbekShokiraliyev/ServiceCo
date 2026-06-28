import { supabase } from "@/lib/supaBase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Job, JobStatus, JobWithTechnician,  } from "@/interface/Interface"

export const useJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          technician:technicians(id, full_name, skill)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as JobWithTechnician[]
    },
  })
}

export const useJobsByTechnician = (technicianId?: string) => {
  return useQuery({
    queryKey: ["jobs", "technician", technicianId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          technician:technicians(id, full_name, skill)
        `)
        .eq("technician_id", technicianId!)
        .order("scheduled_start", { ascending: true })

      if (error) throw error
      return data as JobWithTechnician[]
    },
    enabled: !!technicianId,
  })
}

export const useJobCreate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Omit<Job, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("jobs")
        .insert(payload)
        .select(`
          *,
          technician:technicians(id, full_name, skill)
        `)
        .single()

      if (error) throw error
      return data as JobWithTechnician
    },
    onSuccess: (created) => {
      queryClient.setQueryData<JobWithTechnician[]>(["jobs"], (old) =>
        old ? [created, ...old] : [created]
      )
    },
  })
}

export const useJobUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Job> & { id: string }) => {
      const { data, error } = await supabase
        .from("jobs")
        .update(updates)
        .eq("id", id)
        .select(`
          *,
          technician:technicians(id, full_name, skill)
        `)
        .single()

      if (error) throw error
      return data as JobWithTechnician
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<JobWithTechnician[]>(["jobs"], (old) =>
        old?.map((j) => (j.id === updated.id ? updated : j)) ?? []
      )
      queryClient.setQueryData(["job", updated.id], updated)
    },
  })
}

export const useJobStatusUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: JobStatus }) => {
      const { data, error } = await supabase
        .from("jobs")
        .update({ status })
        .eq("id", id)
        .select(`
          *,
          technician:technicians(id, full_name, skill)
        `)
        .single()

      if (error) throw error
      return data as JobWithTechnician
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<JobWithTechnician[]>(["jobs"], (old) =>
        old?.map((j) => (j.id === updated.id ? updated : j)) ?? []
      )
      queryClient.setQueryData(["jobs", "technician", updated.technician_id], (old: JobWithTechnician[] | undefined) =>
        old?.map((j) => (j.id === updated.id ? updated : j)) ?? []
      )
    },
  })
}

export const useJobDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", id)

      if (error) throw error
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<JobWithTechnician[]>(["jobs"], (old) =>
        old?.filter((j) => j.id !== deletedId) ?? []
      )
    },
  })
}

export const useJobById = (id?: string) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          technician:technicians(id, full_name, skill)
        `)
        .eq("id", id!)
        .single()

      if (error) throw error
      return data as JobWithTechnician
    },
    enabled: !!id,
  })
}