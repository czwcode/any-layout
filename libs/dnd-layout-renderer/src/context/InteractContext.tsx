import { ILayout } from "../types/layout";
import { MutableRefObject, createContext } from "react";
import InteractiveCore from "../interactiveCore";
import { IInteractive } from "../register";

export interface ICreateMutators {
  interactiveCoreRef: MutableRefObject<InteractiveCore>;
  layerRef: React.MutableRefObject<HTMLDivElement>;
  onLayoutChange: (layout: ILayout[]) => void;
  updateLayout: () => void;
  setActiveStatePath: (path: number[]) => void;
}
export function createMutators(options: ICreateMutators): IInteractive {
  const {
    interactiveCoreRef,
    updateLayout,
    onLayoutChange,
    setActiveStatePath,
  } = options;

  return {
    onDrag: (path: number[]) => {
      console.log('onDrag: ', path);
      interactiveCoreRef.current.onDrag(path);
      updateLayout();
    },
    onMove: (dragPath: number[], dropPath: number[], options) => {
      interactiveCoreRef.current.onMove(dragPath, dropPath, options);
      updateLayout();
    },
    onDrop: (dragPath: number[], path: number[], options) => {
      interactiveCoreRef.current.onDrop(dragPath, path, options);
      onLayoutChange(interactiveCoreRef.current.get());
      updateLayout();
    },
    onDropRow: (dragPath: number[], path: number[], options) => {
      interactiveCoreRef.current.onDropRow(path, options.data);
      onLayoutChange(interactiveCoreRef.current.get());
      updateLayout();
    },
    onDragEnd: (path: number[]) => {
      // 回滚布局变更
      // 拖拽到外面的时候，回滚布局
      interactiveCoreRef.current.restore();
      updateLayout();
    },
    onSizeChange: (path, options) => {
      interactiveCoreRef.current.onSizeChange(path, options);
      updateLayout();
    },
    onActive: (path) => {
      setActiveStatePath(path);
    },
  };
}


export const InteractContext = createContext<IInteractive>(null);