import * as React from 'react';
import { useDrag, DragElementWrapper, DragSourceOptions, DragPreviewOptions } from 'react-dnd';
import { DragDropType, ILayout, LayerType } from '../types';
export interface IDragConfig<ITheme> {
  onDrag?: (path: number[]) => void;
  onDragEnd?: (path: number[]) => void;
  path?: number[];
  data?: ILayout<ITheme>;
  layerType?: LayerType
  dragType?: string;
}
export interface DragInfo<ITheme> {
  type: string
  path: number[]
  layerType: LayerType,
  data: ILayout<ITheme>
}
export function useLayoutDrag<T, ITheme>(config: IDragConfig<ITheme>) {
  const {
    onDrag,
    data,
    onDragEnd,
    path,
    layerType,
    dragType = DragDropType.Widget,
  } = config;
  const dragRef = React.useRef<T>(null);
  const [collectionDragProps, drag, preview] = useDrag({
    item: {
      type: dragType,
      path,
      layerType,
      data: JSON.parse(JSON.stringify(data|| {})),
    },
    begin: (monitor) => {
      setTimeout(() => {
        onDrag && onDrag(path);
      }, 0);
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
    end: (dropResult) => {
      onDragEnd && onDragEnd(path);
    },
    canDrag: () => true,
  });
  drag(dragRef);
  return [collectionDragProps, dragRef, drag, preview] as [
    { isDragging: boolean },
    React.MutableRefObject<T>,
    DragElementWrapper<DragSourceOptions>,
    DragElementWrapper<DragPreviewOptions>
  ];
}
