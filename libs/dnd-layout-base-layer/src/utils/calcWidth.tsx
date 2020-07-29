export function toReal(w: number, layerWidth: number) {
  return (w / 24) * layerWidth;
}
export function toVirtual(w: number, layerWidth: number) {
  return Math.floor( w / layerWidth)
}


export interface PositionParams {
  margin: [number, number]
  cols?: number
  rowHeight: number
  containerPadding: [number, number]
  containerWidth: number
}

// Similar to _.clamp
export function clamp(num: number, lowerBound: number, upperBound: number) {
  return Math.max(Math.min(num, upperBound), lowerBound);
}

export function calcWH(
  positionParams: PositionParams,
  width: number,
  height: number,
  x: number,
): { w: number, h: number } {
  const { margin, cols, rowHeight } = positionParams;
  const colWidth = calcGridColWidth(positionParams);

  // width = colWidth * w - (margin * (w - 1))
  // ...
  // w = (width + margin) / (colWidth + margin)
  let w = Math.round((width + margin[0]) / (colWidth + margin[0]));
  let h = Math.round((height + margin[1]) / (rowHeight + margin[1]));

  // Capping
  w = clamp(w, 0, cols - x);
  return { w, h };
}

export type Position = {
  left: number,
  top: number,
  width: number,
  height: number
};
/**
 * Return position on the page given an x, y, w, h.
 * left, top, width, height are all in pixels.
 * @param  {PositionParams} positionParams  Parameters of grid needed for coordinates calculations.
 * @param  {Number}  x                      X coordinate in grid units.
 * @param  {Number}  y                      Y coordinate in grid units.
 * @param  {Number}  w                      W coordinate in grid units.
 * @param  {Number}  h                      H coordinate in grid units.
 * @return {Position}                       Object containing coords.
 */
export function calcGridItemPosition(
  positionParams: PositionParams,
  x: number,
  y: number,
  w: number,
  h: number,
): Position {
  const { margin, containerPadding, rowHeight } = positionParams;
  const colWidth = calcGridColWidth(positionParams);
  const out = {} as Position
 
  out.width = calcGridItemWHPx(w, colWidth, margin[0]);
  out.height = calcGridItemWHPx(h, rowHeight, margin[1]);

  out.top = Math.round((rowHeight + margin[1]) * y + containerPadding[1]);
  out.left = Math.round((colWidth + margin[0]) * x + containerPadding[0]);

  return out;
}
export function calcGridColWidth(positionParams: PositionParams): number {
  const { margin, containerPadding = 0, containerWidth, cols = 24 } = positionParams;
  return (
    (containerWidth - margin[0] * (cols - 1) - containerPadding[0] * 2) / cols
  );
}

  /**
 * Translate x and y coordinates from pixels to grid units.
 * @param  {PositionParams} positionParams  Parameters of grid needed for coordinates calculations.
 * @param  {Number} top                     Top position (relative to parent) in pixels.
 * @param  {Number} left                    Left position (relative to parent) in pixels.
 * @param  {Number} w                       W coordinate in grid units.
 * @param  {Number} h                       H coordinate in grid units.
 * @return {Object}                         x and y in grid units.
 */
export function calcXY(
  positionParams: PositionParams,
  top: number,
  left: number,
): { x: number, y: number } {
  const { margin, cols, rowHeight } = positionParams;
  const colWidth = calcGridColWidth(positionParams);

  // left = colWidth * x + margin * (x + 1)
  // l = cx + m(x+1)
  // l = cx + mx + m
  // l - m = cx + mx
  // l - m = x(c + m)
  // (l - m) / (c + m) = x
  // x = (left - margin) / (coldWidth + margin)
  let x = Math.round((left - margin[0]) / (colWidth + margin[0]));
  let y = Math.round((top - margin[1]) / (rowHeight + margin[1]));
  return { x, y };
}


// This can either be called:
// calcGridItemWHPx(w, colWidth, margin[0])
// or
// calcGridItemWHPx(h, rowHeight, margin[1])
export function calcGridItemWHPx(
  gridUnits: number,
  colOrRowSize: number,
  marginPx: number
) {
  // 0 * Infinity === NaN, which causes problems with resize contraints
  if (!Number.isFinite(gridUnits)) return gridUnits;
  return Math.round(
    colOrRowSize * gridUnits + Math.max(0, gridUnits - 1) * marginPx
  );
}