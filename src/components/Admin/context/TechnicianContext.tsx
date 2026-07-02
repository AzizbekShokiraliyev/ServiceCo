/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react"
import type { ReactNode } from "react"
import {
  useTechnicians,
  useTechnicianCreate,
  useTechnicianDelete,
  useTechnicianUpdate,
} from "@/hooks/useTechnicians"
import { useSickTechnicianIdsToday } from "@/hooks/Usesickreports"
import type { Skill, Technician } from "@/interface/Interface"
import { SKILL_FILTERS } from "../kanban/constants/kanbanConstants"
import { toast } from "sonner"

interface TechnicianContextType {
  technicians: Technician[]
  visibleTechnicians: Technician[]
  techLoading: boolean
  skillFilter: (typeof SKILL_FILTERS)[number]
  setSkillFilter: React.Dispatch<
    React.SetStateAction<(typeof SKILL_FILTERS)[number]>
  >
  sickTechnicianIds: Map<string, string>

  // Mutations
  createTechnician: (variables: { full_name: string; skill: Skill }) => void
  updateTechnician: (variables: {
    id: string
    full_name: string
    skill: Skill
  }) => void
  deleteTechnician: (id: string) => void
  blockIfSick: (tech: Technician) => boolean
}

const TechnicianContext = createContext<TechnicianContextType | undefined>(
  undefined
)

export function TechnicianProvider({ children }: { children: ReactNode }) {
  const [skillFilter, setSkillFilter] =
    useState<(typeof SKILL_FILTERS)[number]>("Barchasi")

  const { data: technicians = [], isLoading: techLoading } = useTechnicians()
  const { mutate: createTechnician } = useTechnicianCreate()
  const { mutate: updateTechnician } = useTechnicianUpdate()
  const { mutate: deleteTechnician } = useTechnicianDelete()
  const { data: sickTechnicianIds = new Map<string, string>() } =
    useSickTechnicianIdsToday()

  const visibleTechnicians = useMemo(
    () =>
      skillFilter === "Barchasi"
        ? technicians
        : technicians.filter((t) => t.skill === skillFilter),
    [technicians, skillFilter]
  )

  const blockIfSick = useCallback(
    (tech: Technician) => {
      const reason = sickTechnicianIds.get(tech.id)
      if (!reason) return false
      toast.error(`${tech.full_name} bugun kasal: ${reason}`, {
        position: "top-center",
      })
      return true
    },
    [sickTechnicianIds]
  )

  const value = useMemo<TechnicianContextType>(
    () => ({
      technicians,
      visibleTechnicians,
      techLoading,
      skillFilter,
      setSkillFilter,
      sickTechnicianIds,
      createTechnician,
      updateTechnician,
      deleteTechnician,
      blockIfSick,
    }),
    [
      technicians,
      visibleTechnicians,
      techLoading,
      skillFilter,
      sickTechnicianIds,
      createTechnician,
      updateTechnician,
      deleteTechnician,
      blockIfSick,
    ]
  )

  return (
    <TechnicianContext.Provider value={value}>
      {children}
    </TechnicianContext.Provider>
  )
}

export function useTechnicianContext() {
  const context = useContext(TechnicianContext)
  if (context === undefined) {
    throw new Error(
      "useTechnicianContext must be used within a TechnicianProvider"
    )
  }
  return context
}
