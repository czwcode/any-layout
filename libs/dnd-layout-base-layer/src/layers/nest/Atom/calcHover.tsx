export enum HoverDirection {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  TOP_OUT = 'topOut',
  BOTTOM_OUT = 'bottomOut',
}
export interface Rect {
  top: number
  bottom: number
  left: number
  right: number
}
export interface Point {
  x: number
  y: number
}
export function calcDirection(rect: Rect, point: Point) {
  const { top, left, bottom, right } = rect
  // 计算容器的宽高
  const height = bottom - top
  const width = right - left
  // 当前移动的点
  const { x, y } = { x: point.x - left, y: point.y - top }
  const xRatio = x / width
  const yRatio = y / height

  // ? 目前先用比较low的方式，后面可以结合鼠标的划入方向，来进行方向的设定
  const areaMap = {
    [HoverDirection.LEFT]: {
      x: [0, 0.25],
      y: [0, height],
    },
    [HoverDirection.RIGHT]: {
      x: [0.75, 1],
      y: [0, height],
    },
    [HoverDirection.TOP_OUT]: {
      x: [0, 1],
      y: [0, 0.25],
    },
    [HoverDirection.BOTTOM_OUT]: {
      x: [0, 1],
      y: [0.75, 1],
    },
    [HoverDirection.TOP]: {
      x: [0.25, 0.75],
      y: [0.25, 0.5],
    },
    [HoverDirection.BOTTOM]: {
      x: [0.25, 0.75],
      y: [0.5, 0.75],
    },
  } as { [key: string]: { x: [number, number]; y: [number, number] } }
  return Object.keys(areaMap).find((key: string) => {
    const direction = areaMap[key]
    if (direction) {
      const { x, y } = direction
      if (xRatio > x[0] && xRatio < x[1] && yRatio > y[0] && yRatio < y[1]) {
        return true
      }
    }
  }) as HoverDirection
}