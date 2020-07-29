import React from 'react';
import { ILayout, Action, DragDirection } from '../types';
import { HoverOptions, DropOptions } from '../hooks/useDrop';
import { IAtomFrameRenderer } from '../renderCore/Travse';

export interface IInteractive {
  onDrag: (path: number[]) => void;
  onDrop: (dragPath: number[], path: number[], options: DropOptions) => void;
  onDropRow: (dragPath: number[], path: number[], options: DropOptions) => void;
  onDragEnd: (path: number[]) => void;
  onActive: (path: number[]) => void;
  onMove: (
    dragPath: number[],
    hoverPath: number[],
    options: HoverOptions
  ) => void;
  onSizeChange: (
    path: number[],
    direction: DragDirection,
    size: number
  ) => void;
}

export interface IAtomRenderer<ITheme> extends IInteractive {
  layout: ILayout<ITheme>;
  path: number[];
  style?: React.CSSProperties;
  atomFrameRenderer: (props: IAtomFrameRenderer) => React.ReactNode;
  children?: React.ReactNode;
  layer?: HTMLDivElement;
  activePath: number[];
}
export interface IAtom<ITheme> {
  layoutType: string;
  atomType: string;
  action?: typeof Action;
  sizeProcess?: (config: ISizeProcess<ITheme>) => ISize;
  renderer: React.ComponentClass<IAtomRenderer<ITheme>> | React.FC<IAtomRenderer<ITheme>>;
}

export interface ISize {
  width?: number;
  height?: number;
}
export interface ISizeProcess<ITheme> {
  layout: ILayout<ITheme>;
  parent: ILayout<ITheme>;
  size: ISize;
  theme: ITheme;
}
const __ATOMS__ = {} as {
  [key: string]: IAtom<any>;
};

/**
 * 组件注册的方法
 *
 * @export
 * @param {IAtom} atom
 */
export function regist<ITheme>(atom: IAtom<ITheme>) {
  const atomType = atom.atomType;
  __ATOMS__[atomType] = atom;
}

/**
 * 获取注册信息的方法
 *
 * @export
 * @returns
 */
export function getRegist() {
  return __ATOMS__;
}
