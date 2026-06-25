// src/hooks/useUserRole.ts
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supaBase"
import type { ProfileRole } from "@/interface/Interface"

export function useUserRole() {
  const [role, setRole] = useState<ProfileRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setRole(null)
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      setRole((profile?.role as ProfileRole) ?? null)
      setLoading(false)
    }

    fetchRole()
  }, [])

  return { role, loading }
}