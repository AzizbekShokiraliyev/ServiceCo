export const HOURS = Array.from({ length: 24 }, (_, i) => i)
export const HOUR_WIDTH = 120
export const TOTAL_WIDTH = HOUR_WIDTH * 24
export const ROW_HEIGHT = 72
export const NAME_COL_WIDTH = 100

export const getRowHeight = (laneCount: number) => {
  const EVENT_HEIGHT = 28; 
  const PADDING = 16; 
  return Math.max(ROW_HEIGHT, laneCount * EVENT_HEIGHT + PADDING);
};