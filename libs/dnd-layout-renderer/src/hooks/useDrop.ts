import * as React from 'react';
import { useDrop, XYCoord, DragElementWrapper } from 'react-dnd';
import { DragDropType, ILayout } from '../types';
import { DragInfo } from './useDrag';
export interface HoverOptions {
  clientOffset: XYCoord;
  dropBoundingRect: DOMRect;
  movePosition: XYCoord;
}
export interface DropOptions extends HoverOptions {
  data: ILayout;
}
export interface IDropConfig {
  onDrop: (
    dragPath: number[],
    dropPath: number[],
    options: DropOptions
  ) => void;
  onHover?: (
    dragPath: number[],
    hoverPath: number[],
    options: DropOptions
  ) => void;
  path?: number[];
  accept?: string;
}
export interface IDropReturnInfo {
  isOver: boolean;
  canDrop: boolean;
}
export const useLayoutDrop = <T extends HTMLElement>(config: IDropConfig) => {
  const ref = React.useRef<T>(null);
  const { onHover, path, accept = DragDropType.Widget, onDrop } = config;
  const positionInfo = React.useRef(null);
  const [collectionDropProps, drop] = useDrop<DragInfo, null, IDropReturnInfo>({
    accept: accept,
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      onDrop(item.path, path, {
        clientOffset,
        dropBoundingRect: ref.current.getBoundingClientRect(),
        movePosition: {
          x:
            (clientOffset.x - positionInfo.current.originMouseX),
          y:
            (clientOffset.y - positionInfo.current.originMouseY),
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
          clientOffset,
          dropBoundingRect: ref.current.getBoundingClientRect(),
          movePosition: {
            x: clientOffset.x - positionInfo.current.originMouseX,
            y: clientOffset.y - positionInfo.current.originMouseY,
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
