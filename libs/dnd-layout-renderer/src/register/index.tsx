import React from 'react';
import {
  ILayout,
  Action,
  LayoutType,
} from '../types';

export interface IComponentRender {
  layout: ILayout;
  parent?: ILayout
  path: number[];
  children?: React.ReactNode;
}
export interface IComponent<T> {
  layoutType: LayoutType;
  atomType: string;
  action?: typeof Action;
  sizeProcess?: (config: ISizeProcess<T>) => ISize;
  renderer: React.ComponentClass<IComponentRender> | React.FC<IComponentRender>;
}

export interface ISize {
  width?: number;
  height?: number;
}
export interface ISizeProcess<ITheme> {
  layout: ILayout;
  parent: ILayout;
  path: number[];
  size: ISize;
  theme: ITheme;
}
let __ATOMS__ = {} as {
  [key: string]: IComponent<any>;
};

/**
 * 组件注册的方法
 *
 * @export
 * @param {IComponent} atom
 */
export function regist(atom: IComponent<any>) {
  const atomType = atom.atomType;
  __ATOMS__[atomType] = atom;
}


export function clearRegist() {
  __ATOMS__ = {}
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
