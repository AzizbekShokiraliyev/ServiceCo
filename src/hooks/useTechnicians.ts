import { supabase } from "@/lib/supaBase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Technician } from "@/interface/Interface"
import type { Skill } from "@/interface/Interface"

// ishchini olish
export const useTechnicians = () => {
  return useQuery({
    queryKey: ["technicians"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technicians")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as Technician[]
    },
  })
}

//ishci yaratish
export const useTechnicianCreate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      full_name: string
      skill: Skill
      phone?: string
      description?: string
    }) => {
      const { data, error } = await supabase
        .from("technicians")
        .insert(payload)
        .select()
        .single()

      if (error) throw error
      return data as Technician
    },
    onSuccess: (created) => {
      queryClient.setQueryData<Technician[]>(["technicians"], (old) =>
        old ? [created, ...old] : [created]
      )
    },
  })
}

//ishchini ochirish
export const useTechnicianDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("technicians")
        .delete()
        .eq("id", id)

      if (error) throw error
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Technician[]>(["technicians"], (old) =>
        old?.filter((t) => t.id !== deletedId) ?? []
      )
    },
  })
}

//Profil sahifasi
export const useTechnicianById = (id?: string) => {
  return useQuery({
    queryKey: ["technician", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technicians")
        .select("*")
        .eq("id", id!)
        .single()

      if (error) throw error
      return data as Technician
    },
    enabled: !!id,
  })
}

// ichini uppdate qiish
export const useTechnicianUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: {
      id: string
      full_name: string
      skill: Skill
      phone?: string
      description?: string
    }) => {
      const { data, error } = await supabase
        .from("technicians")
        .update(payload)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data as Technician
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Technician[]>(["technicians"], (old) =>
        old?.map((t) => (t.id === updated.id ? updated : t)) ?? []
      )
    },
  })
}