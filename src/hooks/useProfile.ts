import { supabase } from "@/lib/supaBase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Profile } from "@/interface/Interface"

// profileni olish
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User topilmadi")

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) throw error
      return data as Profile
    },
  })
}

// profileni update qilish
export const useProfileUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<Pick<Profile, "full_name" | "phone">>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User topilmadi")

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single()

      if (error) throw error
      return data as Profile
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Profile>(["profile"], updated)
    },
  })
}