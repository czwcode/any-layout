import * as React from 'react';
import { useDrop, XYCoord, DragElementWrapper } from 'react-dnd';
import { DragDropType, ILayout } from '../types';
import { DragInfo } from './useDrag';
import { ISize } from '../register';
import { SizeContext } from '../context';
import { ThemeContext, getThemeContext } from '../context/theme';
export interface HoverOptions<ITheme> {
  clientOffset: XYCoord;
  dropBoundingRect: DOMRect;
  movePosition: XYCoord;
  theme: ITheme
  size: ISize
}
export interface DropOptions<ITheme> extends HoverOptions<ITheme> {
  data: ILayout<ITheme>;
}
export interface IDropConfig<ITheme> {
  onDrop: (
    dragPath: number[],
    dropPath: number[],
    options: DropOptions<ITheme>
  ) => void;
  onHover?: (
    dragPath: number[],
    hoverPath: number[],
    options: DropOptions<ITheme>
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
export const useLayoutDrop = <T extends HTMLElement, ITheme>(config: IDropConfig<ITheme>) => {
  const ref = React.useRef<T>(null);
  const { onHover, path, accept = DragDropType.Widget, onDrop } = config;
  const positionInfo = React.useRef(null);
  const theme = React.useContext(getThemeContext<ITheme>())
  const size = React.useContext(SizeContext)
  const [collectionDropProps, drop] = useDrop<DragInfo, null, IDropReturnInfo>({
    accept: accept,
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      onDrop(item.path, path, {
        clientOffset,
        theme,
        size,
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
          theme: theme,
          size,
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
