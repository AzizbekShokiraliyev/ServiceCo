import type { PositionedEvent, TimelineEvent } from "@/interface/Interface"

export const timeToMinutes = (t: string): number => {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

export const minutesToTime = (mins: number): string => {
  const clamped = Math.max(0, Math.min(1439, mins))
  const h = Math.floor(clamped / 60)
  const m = clamped % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

export const assignLanes = (events: TimelineEvent[]): PositionedEvent[] => {
  const sorted = [...events].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  )

  const lanes: number[] = []

  const positioned: PositionedEvent[] = sorted.map((event) => {
    const start = timeToMinutes(event.startTime)
    const end = timeToMinutes(event.endTime)

    let lane = lanes.findIndex((laneEnd) => laneEnd <= start)
    if (lane === -1) lane = lanes.length
    lanes[lane] = end

    return { ...event, laneIndex: lane, laneCount: 0 }
  })

  const totalLanes = lanes.length
  return positioned.map((e) => ({ ...e, laneCount: totalLanes }))
}

export const hasTimeConflict = (
  events: TimelineEvent[],
  targetRowId: string,
  newStartTime: string,
  newEndTime: string,
  excludeEventId?: string
): boolean => {
  const newStart = timeToMinutes(newStartTime)
  const newEnd = timeToMinutes(newEndTime)

  return events.some((event) => {
    if (event.id === excludeEventId) return false
    if (event.rowId !== targetRowId) return false

    const evStart = timeToMinutes(event.startTime)
    const evEnd = timeToMinutes(event.endTime)

    return newStart < evEnd && newEnd > evStart
  })
}
