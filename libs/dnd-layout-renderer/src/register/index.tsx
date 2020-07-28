import React from 'react';
import { ILayout, Action, DragDirection } from '../types';
import { ILayoutTheme } from '../types/theme';
import { HoverOptions, DropOptions } from '../hooks/useDrop';
import { IAtomFrameRenderer } from '../renderCore';

export interface IInteractive {
  onDrag: (path: number[]) => void;
  onDrop: (dragPath: number[], path: number[], options: DropOptions) => void;
  onDropRow: (dragPath: number[], path: number[], options: DropOptions) => void;
  onDragEnd: (path: number[]) => void;
  onActive: (path: number[]) => void;
  onMove: (dragPath: number[], hoverPath: number[], options: HoverOptions) => void
  onSizeChange: (path: number[], direction: DragDirection, size: number) => void
}

export interface IAtomRenderer extends IInteractive {
  layout: ILayout;
  path: number[];
  size: ISize
  style?: React.CSSProperties;
  hidden?: boolean;
  atomFrameRenderer:  (props: IAtomFrameRenderer) => React.ReactNode;
  children?: React.ReactNode;
  layer?: HTMLDivElement
  activePath: number[];
}
export interface IAtom {
  layoutType: string;
  atomType: string;
  action?: typeof Action;
  sizeProcess?: (config: ISizeProcess) => ISize;
  renderer: React.ComponentClass<IAtomRenderer> | React.FC<IAtomRenderer>;
}

export interface ISize {
  width?: number
  height?: number
}
export interface  ISizeProcess {
  layout: ILayout
  parent: ILayout
  size: ISize
  theme: ILayoutTheme
}
const __ATOMS__ = {} as {
  [key: string]: IAtom;
};

/**
 * 组件注册的方法
 *
 * @export
 * @param {IAtom} atom
 */
export function regist(atom: IAtom) {
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
