import { IDragConfig, useLayoutDrag } from './useDrag';
import { IDropConfig, useLayoutDrop, IDropReturnInfo } from './useDrop';
import React from 'react';
import { DragElementWrapper, DragPreviewOptions } from 'react-dnd';

export const useLayoutDragAndDop = <T extends any, ITheme>(
  config: IDragConfig<ITheme> & IDropConfig<ITheme>
) => {
  const [collectionDragProps, dragRef, drag, preview] = useLayoutDrag<T, ITheme>(config);
  //@ts-ignore
  const [collectionDropProps, dropRef] = useLayoutDrop<T, ITheme>(config);
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
