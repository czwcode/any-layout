import React from 'react';
import { ILayout, Action, DragDirection, LayoutType, SizeOptions } from '../types';
import {  DropOptions } from '../hooks/useDrop';
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
    options: DropOptions
  ) => void;
  onSizeChange: (
    path: number[],
    sizeOptions: SizeOptions,
  ) => void;
}

export interface IAtomRenderer extends IInteractive {
  layout: ILayout;
  path: number[];
  style?: React.CSSProperties;
  atomFrameRenderer: (props: IAtomFrameRenderer) => React.ReactNode;
  children?: React.ReactNode;
  layer?: HTMLDivElement;
  activePath: number[];
}
export interface IAtom {
  layoutType: LayoutType;
  atomType: string;
  action?: typeof Action;
  sizeProcess?: (config: ISizeProcess) => ISize;
  renderer: React.ComponentClass<IAtomRenderer> | React.FC<IAtomRenderer>;
}

export interface ISize {
  width?: number;
  height?: number;
}
export interface ISizeProcess {
  layout: ILayout;
  parent: ILayout;
  path: number[]
  size: ISize;
  theme: any;
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
