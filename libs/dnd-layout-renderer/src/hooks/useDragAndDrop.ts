import { IDragConfig, useLayoutDrag } from './useDrag';
import { IDropConfig, useLayoutDrop, IDropReturnInfo } from './useDrop';
import React from 'react';
import { DragElementWrapper, DragPreviewOptions } from 'react-dnd';

export const useLayoutDragAndDop = <T extends any>(
  config: IDragConfig & IDropConfig
) => {
  const [collectionDragProps, dragRef, drag, preview] = useLayoutDrag(config);
  //@ts-ignore
  const [collectionDropProps, dropRef] = useLayoutDrop<T>(config);
  drag(dropRef);
  
  return [collectionDragProps, collectionDropProps, (ref) => {
    dropRef.current = ref
    dragRef.current = ref
  }, preview] as [
    { isDragging: boolean },
    IDropReturnInfo,
    any,
    DragElementWrapper<DragPreviewOptions>
  ];
};
