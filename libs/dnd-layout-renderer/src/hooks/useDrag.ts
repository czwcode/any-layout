import * as React from 'react';
import { useDrag, DragElementWrapper, DragSourceOptions, DragPreviewOptions } from 'react-dnd';
import { DragDropType, ILayout, LayerType } from '../types';
export interface IDragConfig {
  onDrag?: (path: number[]) => void;
  onDragEnd?: (path: number[]) => void;
  path?: number[];
  data?: ILayout;
  layerType?: LayerType
  dragType?: string;
}
export interface DragInfo {
  type: string
  path: number[]
  layerType: LayerType,
  data: ILayout
}
export function useLayoutDrag<T>(config: IDragConfig) {
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
