import React, { createContext } from 'react';
import { ILayout, LayoutType } from '../types/layout';

export interface ITravseRendererFrame {
  children?: React.ReactNode;
  layout: ILayout;
  parent?: ILayout;
  path: number[];
  layoutType: LayoutType;
}

export interface ILayoutTravseContext {
  /**
   * 遍历布局信息，递归渲染布局节点的包裹组件
   *
   * @memberof IRenderCore
   */
  TravseRendererFrame?: (props: ITravseRendererFrame) => JSX.Element;
  /**
   * 修改传递给组件的属性
   *
   * @memberof IRenderCore
   */
  transformProps?: (
    layout: ILayout,
    type: string,
    layoutType: LayoutType
  ) => any;
}
export const LayoutTravseContext = createContext<ILayoutTravseContext>(
  null
);
