import React from 'react';
import {
  IAtom,
  LayoutType,
  IAtomRenderer,
  Action,
  useLayoutDrop,
  INode,
  DropOptions,
  ILayout,
  SizeOptions,
} from 'dnd-layout-renderer';
import { ThemeContext } from 'dnd-layout-renderer';
import { toReal } from '../../../utils/calcWidth';
export const GridLayerType = 'gridLayer';
export function usePrevious<T>(value: T) {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
class RowAction extends Action {
  onRemove(): INode {
    throw new Error("Method not implemented.");
  }
  onSizeChange(options: SizeOptions): void {
    throw new Error("Method not implemented.");
  }
  onDrag() {}
  onDrop(dragPath: number[], dropPath: number[], options: DropOptions) {
    const lastPath = dragPath[dragPath.length - 1];
    const { data, movePosition, dropBoundingRect } = options;
    const { width } = dropBoundingRect
    const node = this.getNode();
    node.children = node.children.filter((item) => !item.hidden );
    relayoutNodes(this.getNode(), lastPath, width, options)
    const { x, y } = generatePosition(
      data,
      lastPath,
      movePosition,
      width,
      node.children
    );
    data.x = x;
    data.y = y;
    this.getNode().children.splice(lastPath, 0, data);
  }
  onMove(dragPath: number[], dropPath: number[], options: DropOptions) {
    const lastPath = dragPath[dragPath.length - 1];
    const { dropBoundingRect } = options;
    const { width } = dropBoundingRect
    relayoutNodes(this.getNode(), lastPath, width , options)
  }
}
function relayoutNodes(node: ILayout, index: number, width: number, options: DropOptions) {
  const {  data, movePosition} = options;
  const { w, h } = data;
  const { x, y } = generatePosition(
    data,
    index,
    movePosition,
    width,
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
function compact(nodes: INode[]) {
  const cachePosition = {};
  nodes.forEach((node) => {
    compactItem(node, cachePosition);
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
function layoutNodes(
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
export type IRange = [number, number];
const GridLayer: IAtom = {
  layoutType: LayoutType.Layer,
  atomType: GridLayerType,
  action: RowAction,
  renderer: (props: IAtomRenderer) => {
    const theme = React.useContext(ThemeContext);
    const { layout, path, size, onMove } = props;
    const [position, setPosition] = React.useState<{
      data: ILayout;
      x: number;
      y: number;
    }>(null);
    const prePosition = usePrevious<{
      data: ILayout;
      x: number;
      y: number;
    }>(position);
    // @ts-ignore
    const [_, ref] = useLayoutDrop<HTMLDivElement>({
      path,
      onHover: (dragPath, path, options) => {
        const { data, movePosition } = options;
        const { x: moveX, y: moveY } = movePosition;
        const lastPath = dragPath[dragPath.length - 1]
        if (!position) {
          const { x, y, w, h } = data;
          setPosition({
            data: data,
            x: x,
            y: y,
          });
        } else {
          const { x, y } = generatePosition(
            data,
            lastPath,
            movePosition,
            size.width,
            layout.children
          );
          // 找到当前合适的位置
          if (prePosition.x !== x || prePosition.y !== y) {
            setPosition({
              data: data,
              x: x,
              y: y,
            });
            onMove(dragPath, path, options);
          }
        }
      },
      onDrop: (dragPath, path, options) => {
        setPosition(null);
        props.onDrop(dragPath, path, options);
      },
    });
    return (
      <div
        ref={ref}
        className='absolute-layer'
        style={{
          width: toReal(layout.w, size.width),
          height: layout.h,
          position: 'relative',
          backgroundSize: '10px 10px',
          backgroundPosition: '1px 1px',
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-90deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 10px)',
        }}
      >
        {props.children}
        {position && (
          <PlaceHolder
            x={toReal(position.x, size.width)}
            y={position.y}
            width={toReal(position.data.w, size.width)}
            height={position.data.h}
          />
        )}
      </div>
    );
  },
};
export interface IPlaceHolder {
  x: number;
  y: number;
  width: number;
  height: number;
}
function generatePosition(
  dragNode: INode,
  index: number,
  movePosition: any,
  width: number,
  nodes: INode[]
) {
  const { x, y, w, h } = dragNode;
  const { x: moveX, y: moveY } = movePosition;
  let currentXOffset = x + Math.floor(moveX / (width / 24));
  currentXOffset = crossBorderProtection(currentXOffset, w);
  // 节点当前的水平范围
  const currentXRange: IRange = [currentXOffset, currentXOffset + w];
  const currentYRange: IRange = [moveY + y, moveY + y + h];
  // 当前节点所有上方的节点
  const intersectItems = getIntersectItems(nodes, currentXRange).filter(item => item.index !== index);
  const upperNodes = getAllUpperNode(intersectItems, currentYRange[1]);
  // 上方节点中最高的Y值
  const newY = getMaxY(upperNodes);
  return { x: currentXOffset, y: newY };
}

function PlaceHolder(props: IPlaceHolder) {
  const { x, y, width, height } = props;
  return (
    <div
      style={{
        background: 'pink',
        position: 'absolute',
        transition: 'all 200ms ease',
        width,
        height,
        left: x,
        top: y,
      }}
    ></div>
  );
}
export default GridLayer;

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
      return isIntersect(getRange(item.data).xRange, compareRange) ;
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
