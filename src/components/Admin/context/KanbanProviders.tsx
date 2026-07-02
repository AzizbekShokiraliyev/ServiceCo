import type { ReactNode } from "react"
import { ViewModeProvider } from "./ViewModeContext"
import { TechnicianProvider } from "./TechnicianContext"
import { JobsProvider } from "./JobsContext"
import { DragAssignProvider } from "./DragAssignContext"

export function KanbanProviders({ children }: { children: ReactNode }) {
  return (
    <ViewModeProvider>
      <TechnicianProvider>
        <JobsProvider>
          <DragAssignProvider>{children}</DragAssignProvider>
        </JobsProvider>
      </TechnicianProvider>
    </ViewModeProvider>
  )
}

export { useTechnicianContext } from "./TechnicianContext"
export { useJobsContext } from "./JobsContext"
export { useDragAssignContext } from "./DragAssignContext"
export { useViewModeContext } from "./ViewModeContext"
