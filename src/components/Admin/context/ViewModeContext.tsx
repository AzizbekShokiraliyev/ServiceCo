import type { ViewModeContextType } from "@/interface/Interface"
import { createContext, useContext, useState, useMemo } from "react"
import type { ReactNode } from "react"

export type ViewMode = "kanban" | "timeline"

const ViewModeContext = createContext<ViewModeContextType | undefined>(
  undefined
)

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("kanban")

  const value = useMemo<ViewModeContextType>(
    () => ({ viewMode, setViewMode }),
    [viewMode]
  )

  return (
    <ViewModeContext.Provider value={value}>
      {children}
    </ViewModeContext.Provider>
  )
}

export function useViewModeContext() {
  const context = useContext(ViewModeContext)
  if (context === undefined) {
    throw new Error("useViewModeContext must be used within a ViewModeProvider")
  }
  return context
}
