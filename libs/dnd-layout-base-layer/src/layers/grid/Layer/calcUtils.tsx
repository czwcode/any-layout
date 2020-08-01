import {
  INode,
  ISize,
  ILayout,
  BaseDndOptions,
  XYCoord,
  DragDirection,
} from 'dnd-layout-renderer';
import { IGridLayoutTheme, ILayerContext } from '../../../context/layerContext';
import { calcMovePosition } from '../../../utils/calcPosition';
import { toVirtual } from '../../../utils/calcWidth';
import { IAnySizeOptions } from '../../../types/layout';
export function setDragSize(direction: DragDirection, dragNode: INode, x, y) {
  switch (direction) {
    case DragDirection.BOTTOM:
      dragNode.h = y + dragNode.h;
      break;
    case DragDirection.LEFT:
      dragNode.w = x + dragNode.w;
      break;
    case DragDirection.RIGHT:
      dragNode.w = x + dragNode.w;
      break;
    default:
      break;
  }
  return dragNode
}
export function createSizeFakeNode(
  dragNode: INode,
  options: IAnySizeOptions<IGridLayoutTheme>
) {
  const {
    direction,
    mouseClientOffset,
    originMouseClientOffset,
    layerContext,
    originNode
  } = options;
  const { width, theme } = layerContext;
  const movePosition = calcMovePosition(
    originMouseClientOffset,
    mouseClientOffset
  );
  const { x, y } = createSizeFakePosition(
    movePosition,
    getPositionParams(theme, width),
    width
  );
  const newNode = setDragSize(direction, JSON.parse(JSON.stringify(originNode)) , x, y);
  dragNode.w = newNode.w
  dragNode.h = newNode.h
  return dragNode;
}
export function createSizeFakePosition(
  movePosition: XYCoord,
  positionParams: PositionParams,
  width: number
) {
  const xOffset = toVirtual(movePosition.x, width);
  const yOffset = Math.floor(movePosition.y / positionParams.rowHeight);

  return {
    x: xOffset,
    y: yOffset,
  };
}
/**
 *
 *  根据鼠标的移动距离，构造移动状态的假节点信息
 * @export
 * @param {INode} originNode 原始节点的信息
 * @param {XYCoord} movePosition 当前移动的x，y方向的偏移量
 * @param {PositionParams} positionParams 计算的位置的辅助参数
 */
export function createMoveFakeNode(
  originNode: INode,
  movePosition: XYCoord,
  positionParams: PositionParams
) {
  const { x, y } = calcXY(positionParams, movePosition.y, movePosition.x);
  return {
    ...originNode,
    x: originNode.x + x,
    y: originNode.y + y,
  };
}

export function createFakeNode(
  originNode: INode,
  sameLevelNodes: INode[],
  theme: IGridLayoutTheme,
  layerWidth: number,
  originMouseClientOffset: XYCoord,
  mouseClientOffset: XYCoord
) {
  const movePosition = calcMovePosition(
    originMouseClientOffset,
    mouseClientOffset
  );

  // 生成真实假节点的位置
  return {
    ...originNode,
    ...createFakeNodePosition(
      // 不包含所有节点
      createMoveFakeNode(
        originNode,
        movePosition,
        getPositionParams(theme, layerWidth)
      ),
      // 包含所有节点
      sameLevelNodes
    ),
  };
}
/**
 *  输入移动状态的假节点，输出实际假节点的位置
 *
 * @param {INode} moveFakeNode 构造出来的假节点
 * @param {INode[]} nodes 所有相关节点，用来判断当前节点的合理位置
 * @returns {{ x:number; y: number }} 实际假节点的位置，x表示生成的水平位置，y表示生成节点的垂直位置
 */
export function createFakeNodePosition(moveFakeNode: INode, nodes: INode[]) {
  const { id, x, y, w, h } = moveFakeNode;
  let currentXOffset = crossBorderProtection(x, w);
  // 节点当前的水平范围
  const currentXRange: IRange = [currentXOffset, currentXOffset + w];
  const currentYRange: IRange = [y, y + h];
  // 当前节点所有上方的节点

  const intersectItems = getIntersectItems(nodes, currentXRange).filter(
    (item) => item.data.id !== id
  );
  const upperNodes = getAllUpperNode(intersectItems, currentYRange[1]);
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

export type IRelayoutOptions = BaseDndOptions & {
  data: INode;
  layerContext: ILayerContext<IGridLayoutTheme>;
};
/**
 * 重新排列所有节点的位置
 *
 * @export
 * @param {ILayout} 和拖拽节点同级的所有节点
 * @param {AnyDropOptions} options
 */
export function relayoutNodes(fakeNode: INode, children: ILayout[]) {
  // 生成真实假节点的位置
  const newNodes = sortNodes(children);
  layoutNodes(newNodes, fakeNode);
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
  nodes.forEach((node) => {
    compactItem(node, nodes);
  });
}
/**
 * 单个节点紧凑布局
 *
 * @param {INode} node
 * @param {*} cache
 */
function compactItem(node: INode, nodes: INode[]) {
  const { x, y, w, h } = node;
  const othersNode = nodes.filter(item => item.id !== node.id)
  // 找到当前节点上方的节点
  const range = [x, x + w] as any;
  const upperNodes = othersNode.filter(item => {
    const itemRange = [item.x, item.x + item.w] as any
    return isIntersect(itemRange, range) && y > item.y
  })
  const maxY = upperNodes.reduce((max, item) => {
    return Math.max(item.y + item.h || 0, max);
  }, 0);
  node.y = maxY;
}
/**
 * 对所有的节点重新布局
 *
 * @export
 * @param {INodeWithIndex[]} nodes
 * @param {INodeWithIndex} fakeItem
 * @param {number} moveH
 */
export function layoutNodes(nodes: INode[], fakeItem: INode) {
  const overlapItems = nodes.filter((item) => collides(item, fakeItem));
  overlapItems.forEach((overlapItem) => {
    overlapItem.y = fakeItem.h + overlapItem.y;
  });
  overlapItems.forEach((overlapItem) => {
    layoutNodes(nodes, overlapItem);
  });
}

/**
 * Given two layoutitems, check if they collide.
 */
export function collides(l1: INode, l2: INode): boolean {
  if (l1.id === l2.id) return false;
  if (l1.x + l1.w <= l2.x) return false; // l1 is left of l2
  if (l1.x >= l2.x + l2.w) return false; // l1 is right of l2
  if (l1.y + l1.h <= l2.y) return false; // l1 is above l2
  if (l1.y >= l2.y + l2.h) return false; // l1 is below l2
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
  width: number,
  node: INode
) {
  const { x, y, w, h } = node;
  return calcGridItemPosition(getPositionParams(theme, width), x, y, w, h);
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
