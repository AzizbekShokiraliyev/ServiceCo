import type {
  KanbanDeal,
  PositionedEvent,
  TimelineEvent,
} from "@/interface/Interface"

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

export const extractHHMM = (
  value: string | null | undefined
): string | null => {
  if (!value) return null
  const timePart = value.includes("T") ? value.split("T")[1] : value
  return timePart.slice(0, 5)
}

export const isValidHHMM = (value: string): boolean =>
  !Number.isNaN(timeToMinutes(value))

// Boshlanish/tugash vaqtini tekshiruvchi funksiya
export const validateTimeRange = (start: string, end: string): string => {
  if (!start || !end) return "Boshlanish va tugash vaqtini kiriting"
  if (start >= end) return "Tugash vaqti boshlanishidan keyin bo'lishi kerak"
  return ""
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

// KanbanDeal ro'yxatini Timeline uchun TimelineEvent ga aylantiradi
export const dealsToEvents = (deals: KanbanDeal[]): TimelineEvent[] =>
  deals
    .filter((d) => d.startTime && d.endTime && d.status !== "Works")
    .map((d) => ({
      id: d.id,
      rowId: d.status,
      title: d.title,
      subtitle: d.client,
      startTime: d.startTime!,
      endTime: d.endTime!,
    }))