import React from 'react';
import {
  ILayout,
  Action,
  DragDirection,
  LayoutType,
  ISizeOptions,
} from '../types';
import { DropOptions } from '../hooks/useDrop';
import { IAtomFrameRenderer } from '../renderCore/LayoutTravse';

export interface IComponentRender {
  layout: ILayout;
  path: number[];
  atomFrameRenderer: (props: IAtomFrameRenderer) => React.ReactNode;
  children?: React.ReactNode;
}
export interface IComponent {
  layoutType: LayoutType;
  atomType: string;
  action?: typeof Action;
  sizeProcess?: (config: ISizeProcess) => ISize;
  renderer: React.ComponentClass<IComponentRender> | React.FC<IComponentRender>;
}

export interface ISize {
  width?: number;
  height?: number;
}
export interface ISizeProcess {
  layout: ILayout;
  parent: ILayout;
  path: number[];
  size: ISize;
  theme: any;
}
const __ATOMS__ = {} as {
  [key: string]: IComponent;
};

/**
 * 组件注册的方法
 *
 * @export
 * @param {IComponent} atom
 */
export function regist(atom: IComponent) {
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
