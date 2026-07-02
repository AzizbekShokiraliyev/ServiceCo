// src/components/Admin/kanban/timeline/useTimelineInteraction.ts
import { minutesToTime, timeToMinutes } from "@/components/Admin/kanban/timeline/utils/timelineUtils"
import type { UseTimelineInteractionProps } from "@/interface/Interface"
import { useState, useRef, useCallback } from "react"


const SNAP_MINS = 15 // 15 minutlik qadamlar bilan siljiydi
const MIN_DUR_MINS = 30 // Minimal davomiylik 30 minut
const MAX_MINS = 1440 // 24 soat * 60

export const useTimelineInteraction = ({
  initialStart,
  initialEnd,
  hourWidth,
  readOnly,
  onSave,
}: UseTimelineInteractionProps) => {
  const [prevInitial, setPrevInitial] = useState({ initialStart, initialEnd })
  const [startMins, setStartMins] = useState(() => timeToMinutes(initialStart))
  const [endMins, setEndMins] = useState(() => timeToMinutes(initialEnd))

  if (
    prevInitial.initialStart !== initialStart ||
    prevInitial.initialEnd !== initialEnd
  ) {
    // Tashqaridan yangi vaqt kelganda state shu zahoti yangilanadi.
    setPrevInitial({ initialStart, initialEnd })
    setStartMins(timeToMinutes(initialStart))
    setEndMins(timeToMinutes(initialEnd))
  }

  const [isInteracting, setIsInteracting] = useState<"move" | "resize" | null>(null)

  // Drag davomida datalarni ushlab turish uchun (Stale Closure muammosi uchun)
  const dragRef = useRef({
    startX: 0,
    origStart: 0,
    origEnd: 0,
    currentStart: 0,
    currentEnd: 0,
    type: "move" as "move" | "resize",
  })

  const onPointerDown = useCallback(
    (e: React.PointerEvent, type: "move" | "resize") => {
      if (readOnly || !onSave) return

      e.preventDefault()
      e.stopPropagation()

      // Sichqoncha karta tashqarisiga chiqib ketsa ham drag uzilmasligi uchun:
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

      const start = timeToMinutes(initialStart)
      const end = timeToMinutes(initialEnd)

      dragRef.current = {
        startX: e.clientX,
        origStart: start,
        origEnd: end,
        currentStart: start,
        currentEnd: end,
        type,
      }
      setIsInteracting(type)

      const onPointerMove = (moveEv: PointerEvent) => {
        const { startX, origStart, origEnd, type } = dragRef.current
        const dx = moveEv.clientX - startX

        // Pixelni minutga o'giramiz va 15 minutlik qadamlarga (snap) moslaymiz
        const deltaMins = Math.round(((dx / hourWidth) * 60) / SNAP_MINS) * SNAP_MINS
        const duration = origEnd - origStart

        if (type === "move") {
          let newStart = origStart + deltaMins
          let newEnd = newStart + duration

          // Chegaralar (00:00 dan oldinga, 24:00 dan keyinga o'tib ketmasligi)
          if (newStart < 0) {
            newStart = 0
            newEnd = duration
          } else if (newEnd > MAX_MINS) {
            newEnd = MAX_MINS
            newStart = MAX_MINS - duration
          }

          dragRef.current.currentStart = newStart
          dragRef.current.currentEnd = newEnd
          setStartMins(newStart)
          setEndMins(newEnd)
        } else if (type === "resize") {
          let newEnd = origEnd + deltaMins

          // Chegaralar (Minimum 30 min, Maximum 24:00)
          if (newEnd < origStart + MIN_DUR_MINS) newEnd = origStart + MIN_DUR_MINS
          if (newEnd > MAX_MINS) newEnd = MAX_MINS

          dragRef.current.currentEnd = newEnd
          setEndMins(newEnd)
        }
      }

      const onPointerUp = () => {
        window.removeEventListener("pointermove", onPointerMove)
        window.removeEventListener("pointerup", onPointerUp)
        window.removeEventListener("pointercancel", onPointerUp)

        setIsInteracting(null)

        const finalStart = dragRef.current.currentStart
        const finalEnd = dragRef.current.currentEnd

        // Agar haqiqatdan o'zgargan bo'lsagina saqlaymiz
        if (finalStart !== dragRef.current.origStart || finalEnd !== dragRef.current.origEnd) {
          onSave(minutesToTime(finalStart), minutesToTime(finalEnd))
        }
      }

      window.addEventListener("pointermove", onPointerMove)
      window.addEventListener("pointerup", onPointerUp)
      window.addEventListener("pointercancel", onPointerUp)
    },
    [initialStart, initialEnd, hourWidth, readOnly, onSave]
  )

  return {
    startMins,
    endMins,
    isInteracting,
    onPointerDown,
  }
}