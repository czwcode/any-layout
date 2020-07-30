import * as React from 'react';
import { IDragConfig, IDropConfig, DropOptions, IDropReturnInfo } from 'dnd-layout-renderer'
import { useAnyLayoutDrag } from './useAnyDrag';
import { useAnyLayoutDrop } from './useAnyDrop';
import { DragElementWrapper, DragPreviewOptions} from 'react-dnd'



export const useAnyLayoutDragAndDop = <T extends any>(
  config: IDragConfig & IDropConfig<DropOptions>
) => {
  const [collectionDragProps, dragRef, drag, preview] = useAnyLayoutDrag(config);
  //@ts-ignore
  const [collectionDropProps, dropRef] = useAnyLayoutDrop<T>(config);
  drag(dropRef);

  return [
    collectionDragProps,
    collectionDropProps,
    (ref) => {
      dropRef.current = ref;
      dragRef.current = ref;
    },
    preview,
  ] as [
    { isDragging: boolean },
    IDropReturnInfo,
    any,
    DragElementWrapper<DragPreviewOptions>
  ];
};
