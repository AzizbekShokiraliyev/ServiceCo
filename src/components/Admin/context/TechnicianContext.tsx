import {
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
import type { Technician, TechnicianContextType } from "@/interface/Interface"
import { SKILL_FILTERS } from "../kanban/constants/kanbanConstants"
import { toast } from "sonner"
import { useTechniciansSickToday } from "@/hooks/Usesickreports"
import { formatSickTooltip } from "@/lib/sickReportUtils"

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
  const { data: sickTechnicianIds = new Map() } = useTechniciansSickToday()

  const visibleTechnicians = useMemo(
    () =>
      skillFilter === "Barchasi"
        ? technicians
        : technicians.filter((t) => t.skill === skillFilter),
    [technicians, skillFilter]
  )

  const blockIfSick = useCallback(
    (tech: Technician) => {
      const info = sickTechnicianIds.get(tech.id)
      if (!info) return false
      toast.error(`${tech.full_name} bugun kasal: ${formatSickTooltip(info)}`, {
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
