import { useProfile } from "./useProfile"

export function useUserRole() {
  const { data: profile, isLoading } = useProfile()

  return {
    role: profile?.role ?? null,
    loading: isLoading,
  }
}