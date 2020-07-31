import * as React from 'react';
import { useDrop, XYCoord, DragElementWrapper } from 'react-dnd';
import { DragDropType, ILayout } from '../types';
import { DragInfo } from './useDrag';
import { ISize } from '../register';
import { SizeContext } from '../context';
export interface BaseDndOptions {
  mouseClientOffset: XYCoord;
  originMouseClientOffset: XYCoord;
}
export interface DropOptions extends BaseDndOptions {
  data: ILayout;
  dropBoundingRect: DOMRect;
  size: ISize;
}
export interface IDropConfig<T extends DropOptions> {
  onDrop: (
    dragPath: number[],
    dropPath: number[],
    options: T
  ) => void;
  onHover?: (
    dragPath: number[],
    hoverPath: number[],
    options: T
  ) => void;
  /**
   * 当前组件的路径，
   */
  path?: number[];
  /**
   * 支持拖入的的类型
   */
  accept?: string;
}
export interface IDropReturnInfo {
  isOver: boolean;
  canDrop: boolean;
}
export const useLayoutDrop = <T extends HTMLElement>(
  config: IDropConfig<DropOptions>
) => {
  const ref = React.useRef<T>(null);
  const { onHover, path, accept = DragDropType.Widget, onDrop } = config;
  const positionInfo = React.useRef(null);
  const size = React.useContext(SizeContext);
  const [collectionDropProps, drop] = useDrop<DragInfo, null, IDropReturnInfo>({
    accept: accept,
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      onDrop(item.path, path, {
        mouseClientOffset: clientOffset,
        size,
        dropBoundingRect: ref.current.getBoundingClientRect(),
        originMouseClientOffset: {
          x: positionInfo.current.originMouseX,
          y: positionInfo.current.originMouseY,
        },
        data: JSON.parse(JSON.stringify(item.data)),
      });
      positionInfo.current = null;
      return null;
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
    canDrop: (item, monitor) => {
      const monitorItem = monitor.getItem();
      return item.type === monitorItem.type;
    },
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const { x, y } = item.data;
      if (!positionInfo.current) {
        positionInfo.current = {
          originX: x,
          originY: y,
          originMouseX: clientOffset.x,
          originMouseY: clientOffset.y,
        };
      }
      onHover &&
        onHover(item.path, path, {
          data: JSON.parse(JSON.stringify(item.data)),
          size,
          mouseClientOffset: clientOffset,
          dropBoundingRect: ref.current.getBoundingClientRect(),
          originMouseClientOffset: {
            x: positionInfo.current.originMouseX,
            y: positionInfo.current.originMouseY,
          },
        });
    },
  });
  drop(ref);
  return [
    {
      ...collectionDropProps,
    },
    ref,
  ] as [IDropReturnInfo, React.MutableRefObject<T>];
};
