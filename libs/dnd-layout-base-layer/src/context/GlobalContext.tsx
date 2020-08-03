import React, { useContext,createContext} from 'react';
import { MutableRefObject} from "react";
import { InteractiveCore, ILayout, INode} from 'dnd-layout-renderer'
import { IAnyDropOptions } from '../actions';
import { IAnySizeOptions } from '../types/layout';
import { IAnyLayoutTheme, useLayerContext } from './layerContext';


export interface IInteractive<ITheme> {
  onDrag: (path: number[]) => void;
  onDrop: (dragPath: number[], path: number[], options: IAnyDropOptions<ITheme>) => void;
  onDragEnd: (path: number[]) => void;
  onActive: (id: string | number) => void;
  onMove: (
    dragPath: number[],
    hoverPath: number[],
    options: IAnyDropOptions<ITheme>
  ) => void;
  onSizeChange: (path: number[], sizeOptions: IAnySizeOptions<ITheme>) => void;
  onSizeChanging: (path: number[], sizeOptions: IAnySizeOptions<ITheme>) => void;
}

export interface ICreateMutators {
  interactiveCoreRef: MutableRefObject<InteractiveCore>;
  onLayoutChange: (layout: ILayout[]) => void;
  setActiveStatePath: (path: string| number) => void;
}
export function createMutators(options: ICreateMutators): IInteractive<IAnyLayoutTheme> {
  const {
    interactiveCoreRef,
    onLayoutChange,
    setActiveStatePath,
  } = options;

  return {
    onDrag: (path: number[]) => {
      interactiveCoreRef.current.onDrag(path);
      onLayoutChange(interactiveCoreRef.current.get())
    },
    onMove: (dragPath: number[], dropPath: number[], options) => {
      interactiveCoreRef.current.onMove(dragPath, dropPath, options);
      onLayoutChange(interactiveCoreRef.current.get())
    },
    onDrop: (dragPath: number[], path: number[], options) => {
      interactiveCoreRef.current.onDrop(dragPath, path, options);
      onLayoutChange(interactiveCoreRef.current.get());
    },
    onDragEnd: (path: number[]) => {
      // 回滚布局变更
      // 拖拽到外面的时候，回滚布局
      interactiveCoreRef.current.restore();
      onLayoutChange(interactiveCoreRef.current.get());
    },
    onSizeChange: (path, options) => {
      interactiveCoreRef.current.onSizeChange(path, options);
      onLayoutChange(interactiveCoreRef.current.get());
    },
    onSizeChanging: (path, options) => {
      interactiveCoreRef.current.onSizeChanging(path, options);
      onLayoutChange(interactiveCoreRef.current.get());
    },
    onActive: (id) => {
      setActiveStatePath(id);
    },
  };
}
export interface IAtomFrameRenderer {
  node: INode;
  width: number;
  height: number;
}

export interface IGlobalContext<ITheme> {
  interact: IInteractive<ITheme>;
  active: string | number
  AtomRenderer: React.FC<IAtomFrameRenderer> |React.ComponentClass<IAtomFrameRenderer>
  layer: React.MutableRefObject<HTMLDivElement>
}
export function useGlobalContext<T>() {
  const layerContext  =useLayerContext<T>()
  const globalContext = useContext(GlobalContext) as any as IGlobalContext<T>
  const { interact} = globalContext
  const { onDrop, onSizeChange, onMove } = interact
  return React.useMemo< IGlobalContext<T>>(() => {
    return {
      ...globalContext,
      interact: {
        ...interact,
        onDrop: (dragPath, dropPath, options) => {
          onDrop(dragPath, dropPath, {
            ...options,
            layerContext
          })
        }
      }
    }
  }, [layerContext, globalContext])
}
export const GlobalContext = createContext<IGlobalContext<IAnyLayoutTheme>>(null);