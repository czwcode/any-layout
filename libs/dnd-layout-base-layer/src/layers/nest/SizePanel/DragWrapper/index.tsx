import DragPanel from '../DragPanel';
import { useState, useCallback, useRef, useEffect } from 'react';
import { produce } from 'immer';
import React from 'react';
import { get } from 'lodash';
import { useEventListener } from '../useEventListener';
import {
  ILayout,
  DragDirection,
  XYCoord,
  ISizeOptions,
} from '@czwcode/dnd-layout-renderer';
export interface DragPaneWrapperProps {
  path: number[];
  realTimeChange?: boolean;
  onStartSizeChange?: () => void;
  onSizeChangeEnd?: () => void;
  onSizeChange?: (options: ISizeOptions) => void;
  onSizeChanging?: (options: ISizeOptions) => void;
  parent?: ILayout;
  widgetLayer?: HTMLDivElement | null;
  layer: HTMLDivElement | null;
}

export interface DragPaneWrapperState {
  activeDragBarDirection: DragDirection | null;
  deltaX: number;
  deltaY: number;
  isSizeDragging: boolean;
  initialPosX: number;
  initialPosY: number;
  currentX: number;
  currentY: number;
}
// export default () => <div />
export default function DragPaneWrapper(props: DragPaneWrapperProps) {
  const {
    parent,
    path,
    realTimeChange = false,
    onSizeChange,
    onSizeChanging,
    onSizeChangeEnd,
    onStartSizeChange: onSizeChangeStart,
    layer,
    widgetLayer,
  } = props;
  const deltaRef = useRef<{ deltaX: number; deltaY: number }>({
    deltaX: 0,
    deltaY: 0,
  });
  const forceUPdate = useForceUpdate();
  const [dragPaneWrapperState, setDragPaneWrapperState] = useState<
    DragPaneWrapperState
  >({
    activeDragBarDirection: null,
    deltaX: 0,
    deltaY: 0,
    isSizeDragging: false,
    initialPosX: 0,
    initialPosY: 0,
    currentX: 0,
    currentY: 0,
  });
  const {
    isSizeDragging,
    deltaX,
    deltaY,
    activeDragBarDirection,
    initialPosX,
    initialPosY,
  } = dragPaneWrapperState;

  // // 定义事件处理
  const startResize = (
    dragDirection: DragDirection,
    event: React.MouseEvent
  ) => {
    const x = event.clientX;
    const y = event.clientY;
    onSizeChangeStart && onSizeChangeStart();
    setDragPaneWrapperState((dragPaneWrapperState) => {
      return produce(
        dragPaneWrapperState,
        (dragPaneWrapperState: DragPaneWrapperState) => {
          dragPaneWrapperState.activeDragBarDirection = dragDirection;
          dragPaneWrapperState.isSizeDragging = true;
          dragPaneWrapperState.initialPosX = x;
          dragPaneWrapperState.initialPosY = y;
          dragPaneWrapperState.deltaX = 0;
          dragPaneWrapperState.deltaY = 0;
        }
      );
    });
  };
  const resizePanel = useCallback(
    (event: React.MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      // !否则拖拽宽度会突然变的很大
      if (isSizeDragging) {
        deltaRef.current = {
          deltaX: x - initialPosX,
          deltaY: y - initialPosY,
        };
        onSizeChanging &&
          onSizeChanging({
            direction: activeDragBarDirection,
            originMouseClientOffset: {
              x: dragPaneWrapperState.initialPosX,
              y: dragPaneWrapperState.initialPosY,
            },
            mouseClientOffset: {
              x,
              y,
            },
          });
        setDragPaneWrapperState((dragPaneWrapperState) => {
          return produce(
            dragPaneWrapperState,
            (dragPaneWrapperState: DragPaneWrapperState) => {
              (dragPaneWrapperState.deltaX = x - initialPosX),
                (dragPaneWrapperState.deltaY = y - initialPosY);
            }
          );
        });
      }
    },
    [isSizeDragging]
  );

  // // useCallback 防止function重复被定义
  const stopResize = useCallback(
    (event: React.MouseEvent) => {
      if (isSizeDragging) {
        const { deltaY, deltaX } = deltaRef.current;
        const x = event.clientX;
        const y = event.clientY;
        onSizeChange &&
          onSizeChange({
            direction: activeDragBarDirection,
            originMouseClientOffset: {
              x: dragPaneWrapperState.initialPosX,
              y: dragPaneWrapperState.initialPosY,
            },
            mouseClientOffset: {
              x,
              y,
            },
          });
        setDragPaneWrapperState((dragPaneWrapperState) => {
          return produce(
            dragPaneWrapperState,
            (dragPaneWrapperState: DragPaneWrapperState) => {
              dragPaneWrapperState.isSizeDragging = false;
              dragPaneWrapperState.activeDragBarDirection = null;
              dragPaneWrapperState.deltaX = 0;
              dragPaneWrapperState.deltaY = 0;
            }
          );
        });
      }
    },
    [isSizeDragging]
  );
  // 绑定事件
  useEventListener('mousemove', resizePanel as any);
  useEventListener('mouseup', stopResize as any);
  // 获取当前激活框的位置信息
  function getPosition() {
    let position = { left: 0, top: 0 };
    const layerRect = layer.getBoundingClientRect();
    return {
      left: position.left,
      top: position.top,
      width: layerRect.width,
      height: layerRect.height,
    };
  }
  const panelRef = useRef(null);

  useEffect(() => {
    const multationRef = new MutationObserver(() => {
      setTimeout(() => {
        forceUPdate();
      }, 0);
    });

    multationRef.observe(widgetLayer, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    return () => {
      multationRef.disconnect();
    };
  }, []);
  const currentColumnIndex = path[path.length - 2];
  const position = getPosition();

  return (
    <DragPanel
      withRef={panelRef}
      left={position.left}
      top={position.top}
      width={position.width}
      height={position.height}
      activeDragBarDirection={dragPaneWrapperState.activeDragBarDirection}
      isFirst={currentColumnIndex === 0}
      isLast={currentColumnIndex === get(parent, ['children'], []).length - 1}
      offsetX={realTimeChange ? 0 : deltaX}
      offsetY={realTimeChange ? 0 : deltaY}
      startResize={startResize}
    />
  );
}

export const useForceUpdate = () => {
  const [state, setState] = useState(1);
  return () => {
    setState((state) => state + 1);
  };
};
