export type DealTimeStatus = "upcoming" | "active" | "overdue" | "none"

export const getDealTimeStatus = (
  startTime?: string,
  endTime?: string
): DealTimeStatus => {
  if (!startTime || !endTime) return "none"

  const now = new Date()

  const toDate = (time: string) => {
    const [h, m] = time.split(":").map(Number)
    const d = new Date(now)
    d.setHours(h, m, 0, 0)
    return d
  }

  const start = toDate(startTime)
  const end = toDate(endTime)

  if (now < start) return "upcoming"
  if (now > end) return "overdue"
  return "active"
}