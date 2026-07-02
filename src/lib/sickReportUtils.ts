export type SickInfo = {
  reason: string
  startDate?: string // "YYYY-MM-DD"
  endDate: string // "YYYY-MM-DD"
}

export type SickInfoMap = Map<string, SickInfo>

const parseDate = (d: string) => {
  const [y, m, day] = d.split("-").map(Number)
  return new Date(y, m - 1, day)
}

const formatShort = (d: string) => {
  const [, m, day] = d.split("-")
  return `${day}.${m}`
}

export const formatSickTooltip = (info: SickInfo): string => {
  if (!info.startDate) {
    return `Kasal · ${formatShort(info.endDate)}gacha — ${info.reason}`
  }

  const start = parseDate(info.startDate)
  const end = parseDate(info.endDate)
  const days =
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const rangeLabel =
    info.startDate === info.endDate
      ? formatShort(info.endDate)
      : `${formatShort(info.startDate)} – ${formatShort(info.endDate)}`

  return `${days} kun kasal (${rangeLabel}) — ${info.reason}`
}

export const formatSickBadge = (info: SickInfo): string =>
  `Kasal · ${formatShort(info.endDate)}gacha`