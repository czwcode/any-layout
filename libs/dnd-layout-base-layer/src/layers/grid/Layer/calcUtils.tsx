import { INode, ISize, ILayout } from 'dnd-layout-renderer';
import { IGridLayoutTheme } from '../../../context/theme';
import { AnyDropOptions } from '../../../actions';
import { calcMovePosition } from '../../../utils/calcPosition';

/**
 * 获取当前移动节点的位置
 *
 * @param {INode} dragNode
 * @param {PositionParams} positionParams
 * @param {number} index
 * @param {{ x: number; y: number }} movePosition
 * @param {number} width
 * @param {INode[]} nodes
 * @returns
 */
export function generatePosition(
  dragNode: INode,
  positionParams: PositionParams,
  movePosition: { x: number; y: number },
  nodes: INode[]
  ) {
    const { id, x, y, w, h } = dragNode;
  const { x: calcX, y: calcY } = calcXY(
    positionParams,
    movePosition.y,
    movePosition.x
  );
  let currentXOffset = crossBorderProtection(calcX + x, w);
  // 节点当前的水平范围
  const currentXRange: IRange = [currentXOffset, currentXOffset + w];
  const currentYRange: IRange = [calcY + y, calcY + y + h];
  // 当前节点所有上方的节点

  const intersectItems = getIntersectItems(nodes, currentXRange).filter(
    (item) => item.data.id !== id
  );
  const upperNodes = getAllUpperNode(intersectItems, currentYRange[1]);
  // console.log('upperNodes: ', movePosition, nodes, upperNodes, currentYRange);
  // 上方节点中最高的Y值
  const newY = getMaxY(upperNodes);
  return { x: currentXOffset, y: newY };
}

function crossBorderProtection(offset: number, w: number) {
  if (offset < 0) {
    offset = 0;
  } else if (offset + w > 24) {
    offset = 24 - w;
  }
  return offset;
}
function getRange(data: INode) {
  const { x, y, w, h } = data;
  return {
    xRange: [x, x + w] as IRange,
    yRange: [y, y + h] as IRange,
  };
}
export type IRange = [number, number];
type INodeWithIndex = { data: INode; index: number };
function isIntersect(currentRange: IRange, compareRange: IRange) {
  return !(
    currentRange[1] <= compareRange[0] || currentRange[0] >= compareRange[1]
  );
}
function getIntersectItems(
  datas: INode[],
  compareRange: IRange
): INodeWithIndex[] {
  return datas
    .map((item, index) => ({ data: item, index }))
    .filter((item) => {
      return isIntersect(getRange(item.data).xRange, compareRange);
    });
}

function getAllUpperNode(nodes: INodeWithIndex[], targetY: number) {
  return nodes.filter((item) => {
    const currentY = getRange(item.data).yRange[1];
    return currentY < targetY;
  });
}

function getMaxY(nodes: INodeWithIndex[]) {
  return nodes.reduce((max, item) => {
    const current = item.data.h + item.data.y;
    return max > current ? max : current;
  }, 0);
}

/**
 * 重新排列所有节点的位置
 *
 * @export
 * @param {ILayout} node
 * @param {number} index
 * @param {number} width
 * @param {AnyDropOptions} options
 */
export function relayoutNodes(
  node: ILayout,
  options: AnyDropOptions
) {
  const { layerContext, data, originMouseClientOffset, mouseClientOffset, size } = options;
  const { theme} = layerContext
  const { w, h } = data;
  const movePosition = calcMovePosition(originMouseClientOffset, mouseClientOffset)
  const { x, y } = generatePosition(
    data,
    getPositionParams(theme, size.width),
    movePosition,
    node.children
  );
  const newNodes = sortNodes(node.children);
  const newNodesWithIndex = newNodes.map((item, index) => ({
    data: item,
    index,
  }));
  const fakeNode = { x, y, w, h } as any;
  layoutNodes(newNodesWithIndex, { data: fakeNode, index: -1 } as any, h);
  compact(sortNodes(newNodes.concat(fakeNode)));
}
/**
 *根据行列顺序，给所有的节点排序
 *
 * @param {INode[]} nodes
 * @returns
 */
function sortNodes(nodes: INode[]) {
  return nodes.slice(0).sort(function (a, b) {
    if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
      return 1;
    } else if (a.y === b.y && a.x === b.x) {
      // Without this, we can get different sort results in IE vs. Chrome/FF
      return 0;
    }
    return -1;
  });
}

enum BoxPositionType {
  Start = 'start',
  End = 'end',
}
function encodePostion(index: number, type: BoxPositionType) {
  return [index, type].join('-');
}
function decodePosition(position): [number, BoxPositionType] {
  return position.split('-');
}
/**
 * 使所有的节点紧凑布局
 *
 * @param {INode[]} nodes
 */
function compact(nodes: INode[]) {
  const cachePosition = {};
  nodes.forEach((node) => {
    compactItem(node, cachePosition);
  });
}
/**
 * 单个节点紧凑布局
 *
 * @param {INode} node
 * @param {*} cache
 */
function compactItem(node: INode, cache: any) {
  const { x, y, w, h } = node;
  const range = [x, x + w];
  const needCheckKeys = Object.keys(cache).filter((key) => {
    let [newKey, boxPositionType] = decodePosition(key);
    newKey = Number(newKey);
    if (boxPositionType === BoxPositionType.Start) {
      return newKey >= range[0] && newKey < range[1];
    } else {
      return newKey > range[0] && newKey <= range[1];
    }
  });
  const maxY = needCheckKeys.reduce((max, key) => {
    return Math.max(cache[key] || 0, max);
  }, 0);
  node.y = maxY;
  cache[encodePostion(x, BoxPositionType.Start)] = node.y + node.h;
  cache[encodePostion(x + w, BoxPositionType.End)] = node.y + node.h;
}
/**
 * 对所有的节点重新布局
 *
 * @export
 * @param {INodeWithIndex[]} nodes
 * @param {INodeWithIndex} fakeItem
 * @param {number} moveH
 */
export function layoutNodes(
  nodes: INodeWithIndex[],
  fakeItem: INodeWithIndex,
  moveH: number
) {
  const overlapItems = nodes.filter((item) => collides(item, fakeItem));
  overlapItems.forEach((overlapItem) => {
    overlapItem.data.y = fakeItem.data.h + overlapItem.data.y;
  });
  overlapItems.forEach((overlapItem) => {
    layoutNodes(nodes, overlapItem, moveH);
  });
}

/**
 * Given two layoutitems, check if they collide.
 */
export function collides(l1: INodeWithIndex, l2: INodeWithIndex): boolean {
  if (l1.index === l2.index) return false;
  if (l1.data.x + l1.data.w <= l2.data.x) return false; // l1 is left of l2
  if (l1.data.x >= l2.data.x + l2.data.w) return false; // l1 is right of l2
  if (l1.data.y + l1.data.h <= l2.data.y) return false; // l1 is above l2
  if (l1.data.y >= l2.data.y + l2.data.h) return false; // l1 is below l2
  return true; // boxes overlap
}

export function getPositionParams(theme: IGridLayoutTheme, width: number) {
  const { gapX, gapY, rowHeight } = theme;
  return {
    containerPadding: [0, 0] as [number, number],
    margin: [gapX, gapY] as [number, number],
    rowHeight: rowHeight,
    containerWidth: width,
  };
}
export function getBoundingRect(
  theme: IGridLayoutTheme,
  size: ISize,
  node: INode
) {
  const { x, y, w, h } = node;
  return calcGridItemPosition(getPositionParams(theme, size.width), x, y, w, h);
}

export interface PositionParams {
  margin: [number, number];
  cols?: number;
  rowHeight: number;
  containerPadding: [number, number];
  containerWidth: number;
}

// Similar to _.clamp
export function clamp(num: number, lowerBound: number, upperBound: number) {
  return Math.max(Math.min(num, upperBound), lowerBound);
}

export function calcWH(
  positionParams: PositionParams,
  width: number,
  height: number,
  x: number
): { w: number; h: number } {
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
  left: number;
  top: number;
  width: number;
  height: number;
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
  h: number
): Position {
  const { margin, containerPadding, rowHeight } = positionParams;
  const colWidth = calcGridColWidth(positionParams);
  const out = {} as Position;

  out.width = calcGridItemWHPx(w, colWidth, margin[0]);
  out.height = calcGridItemWHPx(h, rowHeight, margin[1]);

  out.top = Math.round((rowHeight + margin[1]) * y + containerPadding[1]);
  out.left = Math.round((colWidth + margin[0]) * x + containerPadding[0]);

  return out;
}
export function calcGridColWidth(positionParams: PositionParams): number {
  const {
    margin,
    containerPadding = 0,
    containerWidth,
    cols = 24,
  } = positionParams;
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
  left: number
): { x: number; y: number } {
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
